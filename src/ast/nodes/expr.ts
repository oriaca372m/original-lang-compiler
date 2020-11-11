import { Ctv } from 'Src/ast/compile-time'

import { TypedValueNode } from './primitive'
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
