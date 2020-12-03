import { CtFuncDef } from './ct-func-def'
import { RtFuncDef } from './rt-func-def'
import { CtFunc } from 'Src/ct-tree/ct-func'

export class Program {
	constructor(
		private readonly _ctFuncDef: CtFuncDef[],
		private readonly _rtFuncDef: RtFuncDef[],
		private readonly _ctFuncs: CtFunc[]
	) {}

	get ctFuncDef(): CtFuncDef[] {
		return this._ctFuncDef
	}

	get rtFuncDef(): RtFuncDef[] {
		return this._rtFuncDef
	}

	get ctFuncs(): CtFunc[] {
		return this._ctFuncs
	}
}
