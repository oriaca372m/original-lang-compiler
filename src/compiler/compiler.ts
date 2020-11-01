import * as u from 'Src/utils'
import * as ast from 'Src/ast'
import { Label, Asm, r, rel, imm, addr, State as AsmState } from 'Src/assembler'
import { compileApplyFunction, builtInFunctions } from 'Src/compiler/apply-function'
import { pushVoidValue, copyValue } from 'Src/compiler/utils'
import { compileWhile, compileBreak } from 'Src/compiler/while'
import { compileApplyApplicative } from 'Src/compiler/apply-applicative'
import { ProgramState, FunctionState, LangFunctionInfo } from 'Src/compiler/state'

function compileIf(a: Asm, s: FunctionState, ifNode: ast.If) {
	a.c('if')
	const ifEnd = a.s.labelManager.getLabel()
	const ifElse = a.s.labelManager.getLabel()

	compileExpr(a, s, ifNode.cond)
	a.pop(r.rax)
	a.cmp(imm(0), r.rax)
	a.je(addr(ifElse))

	a.nl()
	a.c('then')
	compileMultipleExpr(a, s, ifNode.body)
	a.jmp(addr(ifEnd))

	a.nl()
	a.c('else')
	a.defLabel(ifElse)
	if (ifNode.elseBody === undefined) {
		u.assert(ifNode.type.core.equals(ast.voidType))
		pushVoidValue(a)
	} else {
		compileMultipleExpr(a, s, ifNode.elseBody)
	}

	a.nl()
	a.c('ifの終わり')
	a.defLabel(ifEnd)
}

function compileImmediateValue(a: Asm, s: FunctionState, immNode: ast.ImmediateValue): void {
	const v = immNode.value
	if (typeof v === 'number') {
		a.push(imm(v))
	} else if (typeof v === 'string') {
		a.push(imm(a.s.sst.getLabel(v)))
	} else if (v === undefined) {
		pushVoidValue(a)
	} else if (v instanceof ast.LangFunction) {
		if (v.isBuiltIn) {
			const builtInLabel = builtInFunctions[v.name]
			if (builtInLabel === undefined) {
				u.assert(false, 'unsupported built-in function!')
			}

			a.push(imm(builtInLabel))
		} else {
			const info = s.ps.langFunctionTable.get(v) ?? u.unreachable()
			a.push(imm(info.label))
		}
	} else {
		u.unreachable(v)
	}
}

function compileArrayLiteral(a: Asm, s: FunctionState, astNode: ast.ArrayLiteral): void {
	for (const expr of u.l.reverse(astNode.exprs)) {
		compileExpr(a, s, expr)
	}
}

export function compileExpr(a: Asm, s: FunctionState, expr: ast.Expr): void {
	const d = expr.value
	if (d instanceof ast.ImmediateValue) {
		compileImmediateValue(a, s, d)
	} else if (d instanceof ast.ApplyFunction) {
		compileApplyFunction(a, s, d)
	} else if (d instanceof ast.VariableRef) {
		a.c(`変数 ${d.value.name} の参照`)
		const vinfo = s.variableTable.get(d.value) ?? u.unreachable()
		a.lea(rel(r.rbp, addr(vinfo.rbpOffset)), r.rsi)
		a.push(r.rsi)
	} else if (d instanceof ast.If) {
		compileIf(a, s, d)
	} else if (d instanceof ast.While) {
		compileWhile(a, s, d)
	} else if (d instanceof ast.LetStmt) {
		compileLetStmt(a, s, d)
	} else if (d instanceof ast.Return) {
		compileReturn(a, s, d)
	} else if (d instanceof ast.ConvertToRValue) {
		compileExpr(a, s, d.from)

		a.c('rvalueに変換')
		a.pop(r.rsi)

		a.sub(imm(d.type.core.size), r.rsp)
		copyValue(a, { base: r.rsi, offset: 0 }, { base: r.rsp, offset: 0 }, d.type.core.size)
	} else if (d instanceof ast.Break) {
		compileBreak(a, s, d)
	} else if (d instanceof ast.ArrayLiteral) {
		compileArrayLiteral(a, s, d)
	} else if (d instanceof ast.ApplyApplicative) {
		compileApplyApplicative(a, s, d)
	} else if (d instanceof ast.NewStruct) {
		a.sub(imm((d.type.core.langStruct ?? u.unreachable()).size), r.rsp)
	} else if (d instanceof ast.MemberAccess) {
		if (d.type.vc.isRValue) {
			u.notImplemented()
		} else {
			compileExpr(a, s, d.expr)
			a.pop(r.rsi)
			a.add(imm(d.member.offset), r.rsi)
			a.push(r.rsi)
		}
	} else if (d instanceof ast.CompileTimeValue) {
		u.assert(false, 'compilerにCompileTimeValueが来てはいけない')
	} else {
		u.unreachable(d)
	}
}

export function compileMultipleExpr(a: Asm, s: FunctionState, exprs: ast.MultipleExpr): void {
	u.assert(exprs.exprs.length !== 0)

	// 最後だけ値を残す
	for (let i = 0; i < exprs.exprs.length - 1; i++) {
		const expr = exprs.exprs[i]
		compileExpr(a, s, expr)

		// スタックから値をどける
		a.add(imm(expr.type.core.size), r.rsp)
	}

	compileExpr(a, s, u.l.last(exprs.exprs) ?? u.unreachable())
}

function compileLetStmt(a: Asm, s: FunctionState, letStmt: ast.LetStmt): void {
	const name = letStmt.variable.name
	const vinfo = s.variableTable.get(letStmt.variable) ?? u.unreachable()

	a.c(`変数 ${name} に代入する値の計算`)
	compileExpr(a, s, letStmt.expr)

	a.c(`変数 ${name} へ代入`)
	const size = letStmt.expr.type.core.size
	copyValue(a, { base: r.rsp, offset: 0 }, { base: r.rbp, offset: vinfo.rbpOffset }, size)
	a.add(imm(size), r.rsp)

	pushVoidValue(a)
}

function compileReturn(a: Asm, s: FunctionState, ret: ast.Return): void {
	compileExpr(a, s, ret.expr)

	a.c('Return')

	const f = s.langFunction
	const size = f.resultType.size
	const info = s.ps.langFunctionTable.get(f) ?? u.unreachable()

	copyValue(
		a,
		{ base: r.rsp, offset: 0 },
		// rbpの退避 + ret pointer 分だけズレる
		{ base: r.rbp, offset: info.totalParamSize + 16 },
		size
	)

	a.mov(r.rbp, r.rsp)
	a.pop(r.rbp)
	a.ret()
	a.nl()
}

function calcVariableOffset(s: FunctionState, df: ast.DefineFunction): void {
	const total = u.l.sumBy(df.localVariables, (x) => x.type.size)
	s.variableTableTotalSize = total

	let offset = 0
	for (const variable of df.localVariables) {
		s.variableTable.set(variable, { offset, rbpOffset: -total + offset })
		offset += variable.type.size
	}
}

function compileDefineFunction(a: Asm, s: ProgramState, df: ast.DefineFunction): void {
	const funcInfo = s.langFunctionTable.get(df.langFunction) ?? u.unreachable()

	if (df.langFunction.name === 'main') {
		a.exportLabel(funcInfo.label)
	}

	a.c(`関数 ${df.langFunction.name} の定義`)
	a.defLabel(funcInfo.label)

	a.c('プロローグ')
	a.push(r.rbp)
	a.mov(r.rsp, r.rbp)

	const fs = new FunctionState(s, df.langFunction)

	calcVariableOffset(fs, df)

	// 引数をローカル変数に移す
	for (let i = 0; i < df.params.length; i++) {
		const param = funcInfo.params[i]
		const variable = df.params[i].variable
		const vinfo = fs.variableTable.get(variable) ?? u.unreachable()

		copyValue(
			a,
			// rbpの退避 + ret pointer 分だけズレる
			{ base: r.rbp, offset: param.offset + 16 },
			{ base: r.rbp, offset: vinfo.rbpOffset },
			param.type.size
		)
	}

	// ローカル変数の領域分スタックポインタをずらす
	a.sub(imm(fs.variableTableTotalSize), r.rsp)

	a.c('本体')
	compileMultipleExpr(a, fs, df.body)
}

function createLangFunctionInfo(s: AsmState, lf: ast.LangFunction): LangFunctionInfo {
	const params = []

	let offset = 0
	for (const param of u.l.reverse(lf.argTypes)) {
		params.push({ type: param, offset })
		offset += param.size
	}

	let label
	if (lf.name === 'main') {
		label = new Label('_main')
	} else {
		label = s.labelManager.getLabel()
	}

	return {
		params: u.l.reverse(params),
		totalParamSize: offset,
		label,
	}
}

export function compileProgram(a: Asm, program: ast.Program): void {
	const s = new ProgramState()

	for (const defineFunction of program.defineFunctions) {
		const func = defineFunction.langFunction
		const v = createLangFunctionInfo(a.s, func)
		s.langFunctionTable.set(func, v)
	}

	for (const defineFunction of program.defineFunctions) {
		compileDefineFunction(a, s, defineFunction)
	}

	a.enterDataSection()
	for (const [label, str] of a.s.sst.getAllString()) {
		a.defLabel(label)
		a.defString(str)
	}
}
