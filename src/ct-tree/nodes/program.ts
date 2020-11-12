import { CtFuncDef } from './ct-func-def'

export class Program {
	constructor(private readonly _ctFuncDef: CtFuncDef[]) {}

	get ctFuncDef(): CtFuncDef[] {
		return this._ctFuncDef
	}
}
