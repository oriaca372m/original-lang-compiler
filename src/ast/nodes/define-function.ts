import { LangFunction } from 'Src/ast/langfunction'
import { Variable } from 'Src/ast/variable'
import { TypeCore } from 'Src/ast/langtype'

import { MultipleExpr } from './misc'

export class FunctionParam {
	constructor(private readonly _variable: Variable, private readonly _typeCore: TypeCore) {}

	get variable(): Variable {
		return this._variable
	}

	get type(): TypeCore {
		return this._typeCore
	}
}

export class DefineFunction {
	constructor(
		private readonly _name: string,
		private readonly _langFunction: LangFunction,
		private readonly _params: FunctionParam[],
		private readonly _localVariables: Variable[],
		private readonly _body: MultipleExpr
	) {}

	get name(): string {
		return this._name
	}

	get langFunction(): LangFunction {
		return this._langFunction
	}

	get params(): FunctionParam[] {
		return this._params
	}

	get localVariables(): Variable[] {
		return this._localVariables
	}

	get body(): MultipleExpr {
		return this._body
	}
}
