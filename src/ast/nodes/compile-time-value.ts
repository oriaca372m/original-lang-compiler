import * as prim from 'Src/ast/nodes/primitive'

import { ValueType } from 'Src/ast/langtype'
import { LangFunction } from 'Src/ast/langfunction'

export type Overload = LangFunction[]

type CompileTimeValueType = Overload
export class CompileTimeValue implements prim.TypedNode {
	constructor(private readonly _value: CompileTimeValueType) {}

	get value(): CompileTimeValueType {
		return this._value
	}

	get type(): ValueType {
		throw 'CompileTimeValueのtypeを取得することは出来ない'
	}
}
