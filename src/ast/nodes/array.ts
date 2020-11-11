import { TypeCore, ValueType, FixedArrayType, rValue } from 'Src/ast/langtype'
import { toRValue } from 'Src/ast/maker/misc'

import { TypedNode } from './primitive'
import { Expr } from './expr'

export class ArrayLiteral implements TypedNode {
	private readonly _exprs: Expr[]
	private readonly _elmType: TypeCore

	constructor(exprs: Expr[]) {
		if (exprs.length < 1) {
			throw '最低1要素は欲しい…'
		}

		this._exprs = exprs.map((x) => toRValue(x))

		this._elmType = this._exprs[0].type.core

		if (!this._exprs.every((x) => x.type.core.equals(this._elmType))) {
			throw 'すべての型が同じであってほしい…'
		}
	}

	get exprs(): Expr[] {
		return this._exprs
	}

	get type(): ValueType<FixedArrayType> {
		const length = this._exprs.length
		return new ValueType(new FixedArrayType(this._elmType, length), rValue)
	}
}
