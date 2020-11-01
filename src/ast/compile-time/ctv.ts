import * as prim from 'Src/ast/nodes/primitive'
import { ValueType } from 'Src/ast/langtype'

import { Overload } from 'Src/ast/compile-time/overload'

type CtvType = Overload

// Compile time value
export class Ctv implements prim.TypedNode {
	constructor(private readonly _value: CtvType) {}

	get value(): CtvType {
		return this._value
	}

	get type(): ValueType {
		throw 'Ctvのtypeを取得することは出来ない'
	}
}
