import * as u from 'Src/utils'
import * as ast from 'Src/ast'
import { Asm, r, imm } from 'Src/assembler'
import { copyValue } from 'Src/compiler/utils'
import { FunctionState } from 'Src/compiler/state'
import { compileExpr } from 'Src/compiler/compiler'
import { compileIndexAccess } from 'Src/compiler/index-access'

function compileSubstitution(a: Asm, s: FunctionState, astNode: ast.ApplyApplicative): void {
	const [dst, src] = astNode.args

	a.c('代入')
	compileExpr(a, s, src)
	compileExpr(a, s, dst)
	a.pop(r.rsi)

	const size = src.type.core.size

	copyValue(a, { base: r.rsp, offset: 0 }, { base: r.rsi, offset: 0 }, astNode.type.core.size)

	a.add(imm(size), r.rsp)
	a.push(r.rsi)
}

function compileGetAddress(a: Asm, s: FunctionState, astNode: ast.ApplyApplicative): void {
	const [operand] = astNode.args

	compileExpr(a, s, operand)
}

function compileDereference(a: Asm, s: FunctionState, astNode: ast.ApplyApplicative): void {
	const [operand] = astNode.args

	compileExpr(a, s, operand)
}

function compilePointerAdd(a: Asm, s: FunctionState, astNode: ast.ApplyApplicative): void {
	const [ptr, delta] = astNode.args

	compileExpr(a, s, ptr)
	compileExpr(a, s, delta)

	// delta
	a.pop(r.rax)

	// address
	a.pop(r.rsi)

	// delta * ポインタの要素のサイズ + address
	a.mov(imm((ptr.type.core as ast.PointerType).elmType.size), r.r11)
	a.mul(r.r11)
	a.add(r.rax, r.rsi)

	a.push(r.rsi)
}

const applicativeTable: {
	[key: string]: (a: Asm, s: FunctionState, astNode: ast.ApplyApplicative) => void
} = {
	substitution: compileSubstitution,
	indexAccess: compileIndexAccess,
	getAddress: compileGetAddress,
	dereference: compileDereference,
	pointerAdd: compilePointerAdd,
}

export function compileApplyApplicative(
	a: Asm,
	s: FunctionState,
	astNode: ast.ApplyApplicative
): void {
	const name = astNode.applicative.name
	const func = applicativeTable[name]

	if (func === undefined) {
		u.notImplemented()
	}

	func(a, s, astNode)
}
