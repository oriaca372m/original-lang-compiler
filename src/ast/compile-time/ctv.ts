import * as prim from 'Src/ast/nodes/primitive'
import { ValueType, TypeCore } from 'Src/ast/langtype'
import { Expr } from 'Src/ast/nodes/expr'

import { Overload } from 'Src/ast/compile-time/overload'
import { convertCtvToExpr } from 'Src/ast/compile-time/utils'

type CtvType = Overload | { kind: 'type'; value: TypeCore }

// Compile time value
export class Ctv implements prim.TypedNode {
	constructor(private readonly _value: CtvType) {}

	get value(): CtvType {
		return this._value
	}

	get type(): ValueType {
		throw 'Ctvのtypeを取得することは出来ない'
	}

	toExpr(): Expr {
		return convertCtvToExpr(this)
	}
}
