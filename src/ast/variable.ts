import { TypeCore } from 'Src/ast/langtype'

export class Variable {
	constructor(private readonly _name: string, private readonly _type: TypeCore) {}

	get name(): string {
		return this._name
	}

	get type(): TypeCore {
		return this._type
	}
}
