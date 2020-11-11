import * as p from 'Src/parser'
import { v4 as uuidv4 } from 'uuid'

import { LangFunction, NormalFunction } from 'Src/ast/langfunction'
import { Variable } from 'Src/ast/variable'
import { voidType } from 'Src/ast/langtype'
import { Name, NameResolver } from 'Src/ast/name'

import * as nodes from 'Src/ast/nodes'
import { ProgramState } from './program'
import { makeMultipleExpr } from './expr'
import { resolveType } from './resolve-type'

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
	currentWhile: nodes.While | undefined

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

export function makeFunctionBody(s: DefineFunctionState, body: p.MultipleStmt): nodes.MultipleExpr {
	const bs = new BlockState(s, s.nameResolver.createChild())
	const stmts = makeMultipleExpr(bs, body).exprs

	const resultType = s.langFunction.resultType

	if (resultType.equals(voidType)) {
		stmts.push(
			new nodes.Expr(new nodes.Return(new nodes.Expr(new nodes.ImmediateValue(undefined))))
		)
		return new nodes.MultipleExpr(stmts)
	}

	const lastIndex = stmts.length - 1
	const last = stmts[lastIndex]

	if (!last.type.isRValueType(resultType)) {
		throw `関数${s.langFunction.name}: 定義と違う型の値を返すな! ${s.langFunction.resultType.name}を返せ!`
	}

	stmts[lastIndex] = new nodes.Expr(new nodes.Return(last))
	return new nodes.MultipleExpr(stmts)
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
): nodes.DefineFunction {
	const dfs = new DefineFunctionState(s, langFunction)

	const params = def.params.value.map((x, i) => {
		const type = langFunction.argTypes[i]
		const variable = new Variable(x.name.value, type)
		dfs.nameResolver.set(new Name(x.name.value, variable))
		return new nodes.FunctionParam(variable, type)
	})

	const body = makeFunctionBody(dfs, def.body)
	const localVariables = [...dfs.nameResolver.getAll()].flatMap((x) =>
		x.value instanceof Variable ? [x.value] : []
	)

	return new nodes.DefineFunction(def.name.value, langFunction, params, localVariables, body)
}
