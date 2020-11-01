import * as prim from 'Src/ast/nodes/primitive'

import { ValueType } from 'Src/ast/langtype'
import { LangFunction } from 'Src/ast/langfunction'

export type Overload = LangFunction[]

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
