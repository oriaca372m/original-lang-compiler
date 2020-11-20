import * as u from 'Src/utils'

import { CtType, intCtType, rtTypeCtType } from 'Src/ct-tree/ct-type'
import { RtType } from 'Src/ct-tree/rt-type'
import { CtFunc } from 'Src/ct-tree/ct-func'

type CtImmediateValueTypes = number | CtFunc | RtType

export class CtImmediateValue {
	private readonly _ctType: CtType

	constructor(private readonly _value: CtImmediateValueTypes) {
		if (_value instanceof CtFunc) {
			this._ctType = _value.toCtFuncType()
		} else if (_value instanceof RtType) {
			this._ctType = rtTypeCtType
		} else if (typeof _value === 'number') {
			this._ctType = intCtType
		} else {
			u.unreachable(_value)
		}
	}

	get value(): CtImmediateValueTypes {
		return this._value
	}

	get ctType(): CtType {
		return this._ctType
	}
}
