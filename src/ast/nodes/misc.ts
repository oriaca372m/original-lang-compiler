import { ValueType, rValue, voidType, ValueCategory } from 'Src/ast/langtype'

import { TypedNode } from './primitive'
import { ImmediateValue } from './immediate-value'
import { Expr } from './expr'

import * as u from 'Src/utils'

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

export class MultipleExpr implements TypedNode {
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
