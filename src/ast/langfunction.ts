import { TypeCore } from 'Src/ast/langtype'

export abstract class LangFunction {
	abstract isBuiltIn: boolean
	abstract name: string
	abstract argTypes: TypeCore[]
	abstract resultType: TypeCore
}

export class NormalFunction extends LangFunction {
	readonly isBuiltIn = false

	constructor(
		private readonly _name: string,
		private readonly _argTypes: TypeCore[],
		private readonly _resultType: TypeCore
	) {
		super()
	}

	get name(): string {
		return this._name
	}

	get argTypes(): TypeCore[] {
		return this._argTypes
	}

	get resultType(): TypeCore {
		return this._resultType
	}
}

export class BuiltInFunction extends LangFunction {
	readonly isBuiltIn = true

	constructor(
		private readonly _name: string,
		private readonly _argTypes: TypeCore[],
		private readonly _resultType: TypeCore
	) {
		super()
	}

	get name(): string {
		return this._name
	}

	get argTypes(): TypeCore[] {
		return this._argTypes
	}

	get resultType(): TypeCore {
		return this._resultType
	}
}
