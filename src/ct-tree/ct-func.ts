import { CtType, CtFuncType } from './ct-type'
import { CtFuncDef } from 'Src/ct-tree/nodes'

export class CtFunc {
	private _ctFuncDef: CtFuncDef | undefined

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

	setFuncDef(ctFuncDef: CtFuncDef): void {
		this._ctFuncDef = ctFuncDef
	}

	get funcDef(): CtFuncDef | undefined {
		return this._ctFuncDef
	}
}
