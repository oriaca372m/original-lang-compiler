import * as p from 'Src/parser'
import { v4 as uuidv4 } from 'uuid'

import { NormalFunction } from 'Src/ast/langfunction'
import { Variable } from 'Src/ast/variable'
import { Name } from 'Src/ast/name'
import { Ctv, Overload } from 'Src/ast/compile-time'

import * as nodes from 'Src/ast/nodes'
import { resolveType } from './resolve-type'
import { DefineFunctionState, BlockState, makeFunctionBody } from './define-function'

function makeDefineFunctionFormDefineFunctionExpr(
	bs: BlockState,
	def: p.DefFunctionExpr
): nodes.DefineFunction {
	const ps = bs.ps

	const argTypes = def.params.value.map((x) => resolveType(ps.nameResolver, x.type))
	const resultType = resolveType(ps.nameResolver, def.resultType)
	const langFunction = new NormalFunction(`__anonymous__${uuidv4()}`, argTypes, resultType)

	const dfs = new DefineFunctionState(ps, langFunction)

	const params = def.params.value.map((x, i) => {
		const type = argTypes[i]
		const variable = new Variable(x.name.value, type)
		dfs.nameResolver.set(new Name(x.name.value, variable))
		return new nodes.FunctionParam(variable, type)
	})

	const body = makeFunctionBody(dfs, def.body)
	const localVariables = [...dfs.nameResolver.getAll()].flatMap((x) =>
		x.value instanceof Variable ? [x.value] : []
	)

	return new nodes.DefineFunction(
		`__anonymous_from_${bs.dfs.langFunction.name}`,
		langFunction,
		params,
		localVariables,
		body
	)
}

export function makeExprFromDefFunctionExpr(s: BlockState, def: p.DefFunctionExpr): nodes.Expr {
	const defineFunction = makeDefineFunctionFormDefineFunctionExpr(s, def)
	s.ps.anonymousFunctions.push(defineFunction)
	return new nodes.Expr(new Ctv(new Overload([defineFunction.langFunction])))
}
