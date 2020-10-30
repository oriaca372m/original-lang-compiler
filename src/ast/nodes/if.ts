import * as p from 'Src/parser'

import { ValueType, rValue, intType, voidType } from 'Src/ast/langtype'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { MultipleExpr, makeMultipleExpr, forceVoid } from 'Src/ast/nodes/misc'
import { Expr, makeExprFormExpr } from 'Src/ast/nodes/expr'

// コンパイラは戻り値の処理をよしなにやってくれる多分
export class If implements prim.TypedNode {
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

export function makeIf(s: BlockState, ifNode: p.If): If {
	return new If(
		makeExprFormExpr(s, ifNode.cond),
		makeMultipleExpr(s, ifNode.body),
		ifNode.elseBody === undefined ? undefined : makeMultipleExpr(s, ifNode.elseBody)
	)
}
