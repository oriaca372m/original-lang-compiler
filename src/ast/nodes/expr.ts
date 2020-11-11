import { ValueType } from 'Src/ast/langtype'
import { Ctv } from 'Src/ast/compile-time'

import { TypedValueNode, TypedNode } from './primitive'
import { ImmediateValue } from './immediate-value'
import { If } from './if'
import { While, Break } from './while'
import { ArrayLiteral } from './array'
import { NewStruct, MemberAccess } from './struct'
import { VariableRef, LetStmt } from './variable'
import { ApplyFunction } from './apply-function'
import { ApplyApplicative } from './apply-applicative'
import { Return, ConvertToRValue } from './misc'
import { Cast } from './cast'

import * as u from 'Src/utils'

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

type ExprType =
	| ImmediateValue
	| ApplyFunction
	| VariableRef
	| If
	| While
	| LetStmt
	| Return
	| ConvertToRValue
	| Break
	| ArrayLiteral
	| ApplyApplicative
	| NewStruct
	| MemberAccess
	| Cast
	| Ctv
export class Expr extends TypedValueNode<ExprType> {}
