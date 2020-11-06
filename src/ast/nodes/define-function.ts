import * as p from 'Src/parser'
import { v4 as uuidv4 } from 'uuid'

import { LangFunction, NormalFunction } from 'Src/ast/langfunction'
import { Variable } from 'Src/ast/variable'
import { TypeCore, voidType } from 'Src/ast/langtype'
import { Name, NameResolver } from 'Src/ast/name'
import { ImmediateValue } from 'Src/ast/nodes/immediate-value'

import { ProgramState } from 'Src/ast/nodes/program'
import { makeMultipleExpr, Return, MultipleExpr } from 'Src/ast/nodes/misc'
import { Expr } from 'Src/ast/nodes/expr'
import { While } from 'Src/ast/nodes/while'
import { resolveType } from 'Src/ast/nodes/resolve-type'

export class BlockState {
	constructor(
		private readonly _dfs: DefineFunctionState,
		private readonly _nameResolver: NameResolver
	) {}

	get ps(): ProgramState {
		return this._dfs.ps
	}

	get dfs(): DefineFunctionState {
		return this._dfs
	}

	get nameResolver(): NameResolver {
		return this._nameResolver
	}
}

export class DefineFunctionState {
	private readonly _nameResolver: NameResolver
	currentWhile: While | undefined

	constructor(private readonly _ps: ProgramState, private readonly _langFunction: LangFunction) {
		this._nameResolver = _ps.nameResolver.createChild()
	}

	get ps(): ProgramState {
		return this._ps
	}

	get langFunction(): LangFunction {
		return this._langFunction
	}

	get nameResolver(): NameResolver {
		return this._nameResolver
	}
}

export class FunctionParam {
	constructor(private readonly _variable: Variable, private readonly _typeCore: TypeCore) {}

	get variable(): Variable {
		return this._variable
	}

	get type(): TypeCore {
		return this._typeCore
	}
}

export function makeFunctionBody(s: DefineFunctionState, def: p.DefFunction): MultipleExpr {
	const bs = new BlockState(s, s.nameResolver.createChild())
	const stmts = makeMultipleExpr(bs, def.body).exprs

	const resultType = s.langFunction.resultType

	if (resultType.equals(voidType)) {
		stmts.push(new Expr(new Return(new Expr(new ImmediateValue(undefined)))))
		return new MultipleExpr(stmts)
	}

	const lastIndex = stmts.length - 1
	const last = stmts[lastIndex]

	if (!last.type.isRValueType(resultType)) {
		throw `関数${s.langFunction.name}: 定義と違う型の値を返すな! ${s.langFunction.resultType.name}を返せ!`
	}

	stmts[lastIndex] = new Expr(new Return(last))
	return new MultipleExpr(stmts)
}

export class DefineFunction {
	constructor(
		private readonly _name: string,
		private readonly _langFunction: LangFunction,
		private readonly _params: FunctionParam[],
		private readonly _localVariables: Variable[],
		private readonly _body: MultipleExpr
	) {}

	get name(): string {
		return this._name
	}

	get langFunction(): LangFunction {
		return this._langFunction
	}

	get params(): FunctionParam[] {
		return this._params
	}

	get localVariables(): Variable[] {
		return this._localVariables
	}

	get body(): MultipleExpr {
		return this._body
	}
}

export function readFunctionDecl(nameResolver: NameResolver, def: p.DefFunction): LangFunction {
	const types = def.params.value.map((x) => resolveType(nameResolver, x.type))
	const resultType = resolveType(nameResolver, def.resultType)
	return new NormalFunction(`${def.name.value}__${uuidv4()}`, types, resultType)
}

export function makeDefineFunction(
	s: ProgramState,
	def: p.DefFunction,
	langFunction: LangFunction
): DefineFunction {
	const dfs = new DefineFunctionState(s, langFunction)

	const params = def.params.value.map((x, i) => {
		const type = langFunction.argTypes[i]
		const variable = new Variable(x.name.value, type)
		dfs.nameResolver.set(new Name(x.name.value, variable))
		return new FunctionParam(variable, type)
	})

	const body = makeFunctionBody(dfs, def)
	const localVariables = []

	for (const name of dfs.nameResolver.getAll()) {
		if (name.value instanceof Variable) {
			localVariables.push(name.value)
		}
	}

	return new DefineFunction(def.name.value, langFunction, params, localVariables, body)
}
