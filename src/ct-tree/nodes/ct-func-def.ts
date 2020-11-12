import { CtType } from 'Src/ct-tree/ct-type'

import { CtMultipleExpr } from './ct-expr'

export class CtFuncParam {
	constructor(private readonly _variable: string, private readonly _ctType: CtType) {}

	get variable(): string {
		return this._variable
	}

	get ctType(): CtType {
		return this._ctType
	}
}

export class CtFuncDef {
	constructor(
		private readonly _name: string,
		private readonly _params: CtFuncParam[],
		private readonly _resultType: CtType,
		private readonly _body: CtMultipleExpr
	) {}

	get name(): string {
		return this._name
	}

	get params(): CtFuncParam[] {
		return this._params
	}

	get resultType(): CtType {
		return this._resultType
	}

	get body(): CtMultipleExpr {
		return this._body
	}
}
