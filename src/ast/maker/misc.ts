import * as p from 'Src/parser'

import { voidType } from 'Src/ast/langtype'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { makeExprFormStmt } from './expr'

export function makeMultipleExpr(s: BlockState, stmts: p.MultipleStmt): nodes.MultipleExpr {
	const bs = new BlockState(s.dfs, s.nameResolver.createChild())
	const exprs = stmts.value.map((x) => makeExprFormStmt(bs, x))
	return new nodes.MultipleExpr(exprs)
}

export function toRValue(expr: nodes.Expr): nodes.Expr {
	if (expr.type.vc.isRValue) {
		return expr
	}

	return new nodes.Expr(new nodes.ConvertToRValue(expr))
}

export function forceVoid(exprs: nodes.MultipleExpr): nodes.MultipleExpr {
	if (exprs.type.isRValueType(voidType)) {
		return exprs
	}

	return new nodes.MultipleExpr([
		...exprs.exprs,
		new nodes.Expr(new nodes.ImmediateValue(undefined)),
	])
}
