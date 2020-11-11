import * as u from 'Src/utils'

import { ValueType, FunctionType, rValue, intType, stringType, voidType } from 'Src/ast/langtype'
import { LangFunction } from 'Src/ast/langfunction'

import { TypedNode } from './primitive'

type ImmediateValueTypes = number | string | undefined | LangFunction

export class ImmediateValue implements TypedNode {
	private readonly _type: ValueType

	constructor(private readonly _value: ImmediateValueTypes) {
		if (typeof _value === 'number') {
			this._type = new ValueType(intType, rValue)
		} else if (typeof _value === 'string') {
			this._type = new ValueType(stringType, rValue)
		} else if (_value === undefined) {
			this._type = new ValueType(voidType, rValue)
		} else if (_value instanceof LangFunction) {
			this._type = new ValueType(new FunctionType(_value.argTypes, _value.resultType), rValue)
		} else {
			u.unreachable(_value)
		}
	}

	get value(): ImmediateValueTypes {
		return this._value
	}

	get type(): ValueType {
		return this._type
	}
}
