import { DefineFunction } from './define-function'

export class Program {
	constructor(private readonly _defineFunctions: DefineFunction[]) {}

	get defineFunctions(): DefineFunction[] {
		return this._defineFunctions
	}
}
