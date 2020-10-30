import * as p from 'Src/parser'

import { ValueType, rValue, voidType, ValueCategory } from 'Src/ast/langtype'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { ImmediateValue } from 'Src/ast/nodes/immediate-value'
import { Expr, makeExprFormStmt } from 'Src/ast/nodes/expr'

import * as u from 'Src/utils'

export class Return implements prim.TypedNode {
	constructor(private readonly _expr: Expr) {}

	get expr(): Expr {
		return this._expr
	}

	get type(): ValueType {
		return new ValueType(voidType, rValue)
	}

	get vc(): ValueCategory {
		return new ValueCategory(true)
	}
}

export class MultipleExpr implements prim.TypedNode {
	constructor(private readonly _exprs: Expr[]) {
		if (_exprs.length === 0) {
			this._exprs = [new Expr(new ImmediateValue(undefined))]
		}
	}

	get exprs(): Expr[] {
		return this._exprs
	}

	private get _last(): Expr {
		return u.l.last(this._exprs) ?? u.unreachable()
	}

	get type(): ValueType {
		return this._last.type
	}
}

export function makeMultipleExpr(s: BlockState, stmts: p.MultipleStmt): MultipleExpr {
	const bs = new BlockState(s.dfs, s.nameResolver.createChild())
	const exprs = stmts.value.map((x) => makeExprFormStmt(bs, x))
	return new MultipleExpr(exprs)
}

export class ConvertToRValue implements prim.TypedNode {
	constructor(private readonly _from: Expr) {
		if (_from.type.vc.isRValue) {
			throw 'いらんよねそれ'
		}
	}

	get from(): Expr {
		return this._from
	}

	get type(): ValueType {
		return this._from.type.getRValue()
	}
}

export function toRValue(expr: Expr): Expr {
	if (expr.type.vc.isRValue) {
		return expr
	}

	return new Expr(new ConvertToRValue(expr))
}

export function forceVoid(exprs: MultipleExpr): MultipleExpr {
	if (exprs.type.isRValueType(voidType)) {
		return exprs
	}

	return new MultipleExpr([...exprs.exprs, new Expr(new ImmediateValue(undefined))])
}
