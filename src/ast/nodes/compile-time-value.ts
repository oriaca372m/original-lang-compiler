import * as prim from 'Src/ast/nodes/primitive'

import { ValueType } from 'Src/ast/langtype'
import { LangFunction } from 'Src/ast/langfunction'
import { Expr } from 'Src/ast/nodes/expr'
import { ImmediateValue } from 'Src/ast/nodes/immediate-value'

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

export function convertCtvToExpr(ctv: CompileTimeValue): Expr {
	return new Expr(new ImmediateValue(ctv.value[0]))
}
