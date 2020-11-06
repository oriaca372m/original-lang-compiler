import { Ctv } from 'Src/ast/compile-time/ctv'

export class CtVariable {
	constructor(private readonly _name: string, private readonly _value: Ctv) {}

	get name(): string {
		return this._name
	}

	get value(): Ctv {
		return this._value
	}
}
