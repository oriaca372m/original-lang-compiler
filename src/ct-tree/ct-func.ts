import { CtType, CtFuncType } from './ct-type'

export class CtFunc {
	constructor(
		private readonly _name: string,
		private readonly _argTypes: CtType[],
		private readonly _resultType: CtType
	) {}

	get name(): string {
		return this._name
	}

	get argTypes(): CtType[] {
		return this._argTypes
	}

	get resultType(): CtType {
		return this._resultType
	}

	toCtFuncType(): CtFuncType {
		return new CtFuncType(this.argTypes, this.resultType)
	}
}
