import * as p from 'Src/parser'
import { v4 as uuidv4 } from 'uuid'

import { NormalFunction } from 'Src/ast/langfunction'
import { Variable } from 'Src/ast/variable'
import { Name } from 'Src/ast/name'

import { resolveType } from 'Src/ast/nodes/resolve-type'
import {
	DefineFunction,
	DefineFunctionState,
	FunctionParam,
	BlockState,
	makeFunctionBody,
} from 'Src/ast/nodes/define-function'
import { Expr } from 'Src/ast/nodes/expr'
import { Ctv, Overload } from 'Src/ast/compile-time'

function makeDefineFunctionFormDefineFunctionExpr(
	bs: BlockState,
	def: p.DefFunctionExpr
): DefineFunction {
	const ps = bs.ps

	const argTypes = def.params.value.map((x) => resolveType(ps.nameResolver, x.type))
	const resultType = resolveType(ps.nameResolver, def.resultType)
	const langFunction = new NormalFunction(`__anonymous__${uuidv4()}`, argTypes, resultType)

	const dfs = new DefineFunctionState(ps, langFunction)

	const params = def.params.value.map((x, i) => {
		const type = argTypes[i]
		const variable = new Variable(x.name.value, type)
		dfs.nameResolver.set(new Name(x.name.value, variable))
		return new FunctionParam(variable, type)
	})

	const body = makeFunctionBody(dfs, def.body)
	const localVariables = []

	for (const name of dfs.nameResolver.getAll()) {
		if (name.value instanceof Variable) {
			localVariables.push(name.value)
		}
	}

	return new DefineFunction(
		`__anonymous_from_${bs.dfs.langFunction.name}`,
		langFunction,
		params,
		localVariables,
		body
	)
}

export function makeExprFromDefFunctionExpr(s: BlockState, def: p.DefFunctionExpr): Expr {
	const defineFunction = makeDefineFunctionFormDefineFunctionExpr(s, def)
	s.ps.anonymousFunctions.push(defineFunction)
	return new Expr(new Ctv(new Overload([defineFunction.langFunction])))
}
