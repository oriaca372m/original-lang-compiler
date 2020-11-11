import { ValueType, rValue, intType, voidType } from 'Src/ast/langtype'
import { forceVoid } from 'Src/ast/maker'

import { TypedNode } from './primitive'
import { MultipleExpr } from './misc'
import { Expr } from './expr'

// コンパイラは戻り値の処理をよしなにやってくれる多分
export class If implements TypedNode {
	private readonly _type: ValueType

	constructor(
		private readonly _cond: Expr,
		private readonly _body: MultipleExpr,
		private readonly _elseBody: MultipleExpr | undefined
	) {
		if (!_cond.type.isRValueType(intType)) {
			throw 'ifの条件式はint rvalueでよろしく'
		}

		if (_elseBody === undefined) {
			this._type = new ValueType(voidType, rValue)
			return
		}

		if (!_body.type.equals(_elseBody.type)) {
			this._body = forceVoid(_body)
			this._elseBody = forceVoid(_elseBody)
			this._type = new ValueType(voidType, rValue)
			return
		}

		this._type = _body.type
	}

	get cond(): Expr {
		return this._cond
	}

	get body(): MultipleExpr {
		return this._body
	}

	get elseBody(): MultipleExpr | undefined {
		return this._elseBody
	}

	get type(): ValueType {
		return this._type
	}
}
