import { TypeCore, ValueType, rValue, intType, PointerType } from 'Src/ast/langtype'

import { TypedNode } from './primitive'
import { Expr } from './expr'

export class Cast implements TypedNode {
	constructor(private readonly _expr: Expr, private readonly _toType: TypeCore) {
		if (!_expr.type.vc.isRValue) {
			throw 'castの式はrvalueで!'
		}

		// 同じ型なら許可
		if (_toType.equals(_expr.type.core)) {
			return
		}

		// intからpointerへの変換は許可
		if (_expr.type.core.equals(intType) && _toType instanceof PointerType) {
			return
		}

		// pointerからintへの変換は許可
		if (_expr.type.core instanceof PointerType && _toType.equals(intType)) {
			return
		}

		// pointerからpointerへの変換は許可
		if (_expr.type.core instanceof PointerType && _toType instanceof PointerType) {
			return
		}

		throw 'サポートしていない変換!'
	}

	get expr(): Expr {
		return this._expr
	}

	get type(): ValueType {
		return new ValueType(this._toType, rValue)
	}
}
