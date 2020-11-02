import * as p from 'Src/parser'

import { TypeCore, ValueType, rValue, intType, PointerType } from 'Src/ast/langtype'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { Expr, makeExprFormExpr } from 'Src/ast/nodes/expr'
import { resolveType } from 'Src/ast/nodes/resolve-type'
import { toRValue } from 'Src/ast/nodes/misc'

export class Cast implements prim.TypedNode {
	constructor(private readonly _expr: Expr, private readonly _toType: TypeCore) {
		if (!_expr.type.vc.isRValue) {
			throw 'castの式はrvalueで!'
		}

		// intからpointerへの変換は許可
		if (_expr.type.core.equals(intType) && _toType instanceof PointerType) {
			return
		}

		// pointerからintへの変換は許可
		if (_expr.type.core instanceof PointerType && _toType.equals(intType)) {
			return
		}

		if (!_toType.equals(_expr.type.core)) {
			throw 'サポートしていない変換!'
		}
	}

	get expr(): Expr {
		return this._expr
	}

	get type(): ValueType {
		return new ValueType(this._toType, rValue)
	}
}

export function makeCast(s: BlockState, parserNode: p.Cast): Cast {
	return new Cast(
		toRValue(makeExprFormExpr(s, parserNode.expr)),
		resolveType(s.nameResolver, parserNode.toType)
	)
}
