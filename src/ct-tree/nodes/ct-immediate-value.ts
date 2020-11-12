import * as u from 'Src/utils'

import { CtType, intCtType } from 'Src/ct-tree/ct-type'

import { CtFuncDef } from './ct-func-def'

type CtImmediateValueTypes = number | CtFuncDef

export class CtImmediateValue {
	private readonly _ctType: CtType

	constructor(private readonly _value: CtImmediateValueTypes) {
		if (_value instanceof CtFuncDef) {
			// TODO: とりあえず
			this._ctType = intCtType
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
