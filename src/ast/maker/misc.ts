import { voidType } from 'Src/ast/langtype'

import * as nodes from 'Src/ast/nodes'

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
