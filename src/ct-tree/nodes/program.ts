import { CtFuncDef } from './ct-func-def'
import { RtFuncDef } from './rt-func-def'

export class Program {
	constructor(
		private readonly _ctFuncDef: CtFuncDef[],
		private readonly _rtFuncDef: RtFuncDef[]
	) {}

	get ctFuncDef(): CtFuncDef[] {
		return this._ctFuncDef
	}

	get rtFuncDef(): RtFuncDef[] {
		return this._rtFuncDef
	}
}
