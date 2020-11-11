import * as p from 'Src/parser'

import { Variable } from 'Src/ast/variable'
import { Name } from 'Src/ast/name'
import { Ctv, CtVariable } from 'Src/ast/compile-time'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { makeExprFormExpr } from './expr'
import { toRValue } from './misc'

export function makeExprFromIdentifier(s: BlockState, v: p.Identifier): nodes.Expr {
	const name = v.value
	const nameValue = s.nameResolver.resolve(v.value)?.value

	if (nameValue === undefined) {
		throw `名前が見つからない: ${name}`
	}

	if (nameValue instanceof Variable) {
		return new nodes.Expr(new nodes.VariableRef(nameValue))
	} else if (nameValue instanceof CtVariable) {
		return new nodes.Expr(nameValue.value)
	}

	throw `変数じゃないなにかを参照してる: ${name}`
}

export function makeExprFromLetStmt(s: BlockState, stmt: p.LetStmt): nodes.Expr {
	const name = stmt.name.value
	const expr = makeExprFormExpr(s, stmt.expr)
	if (expr.value instanceof Ctv) {
		s.nameResolver.set(new Name(name, new CtVariable(name, expr.value)))
		return new nodes.Expr(new nodes.ImmediateValue(undefined))
	} else {
		const variable = new Variable(name, expr.type.core)
		s.nameResolver.set(new Name(name, variable))
		return new nodes.Expr(new nodes.LetStmt(variable, toRValue(expr)))
	}
}
