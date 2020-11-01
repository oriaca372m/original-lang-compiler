import { LangFunction } from 'Src/ast/langfunction'

export class Overload {
	constructor(private readonly _value: LangFunction[]) {}

	get value(): LangFunction[] {
		return this._value
	}

	addCandidate(func: LangFunction): void {
		this._value.push(func)
	}
}
