import { ValueType, rValue, voidType, ValueCategory } from 'Src/ast/langtype'

import { TypedNode } from './primitive'
import { Expr } from './expr'

export class Return implements TypedNode {
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

export class ConvertToRValue implements TypedNode {
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
