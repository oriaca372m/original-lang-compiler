import { ValueType, intType, voidType, rValue } from 'Src/ast/langtype'

import { TypedNode } from './primitive'
import { Expr, MultipleExpr } from './expr'

export class While implements TypedNode {
	private _cond!: Expr
	private _body!: MultipleExpr

	init(_cond: Expr, _body: MultipleExpr): void {
		if (!_cond.type.isRValueType(intType)) {
			throw 'whileの条件式はrvalue intでよろしく'
		}

		this._cond = _cond
		this._body = _body
	}

	get cond(): Expr {
		return this._cond
	}

	get body(): MultipleExpr {
		return this._body
	}

	get type(): ValueType {
		return new ValueType(voidType, rValue)
	}
}

export class Break implements TypedNode {
	constructor(private readonly _target: While) {}

	get target(): While {
		return this._target
	}

	get type(): ValueType {
		return new ValueType(voidType, rValue)
	}
}
