import { rtTypeCtType } from 'Src/ct-tree/ct-type'

import { CtExpr } from './ct-expr'
import { RtMultipleExpr } from './rt-expr'

export class RtFuncParam {
	constructor(private readonly _variable: string, private readonly _type: CtExpr) {
		if (!_type.ctType.equals(rtTypeCtType)) {
			throw '型じゃない'
		}
	}

	get variable(): string {
		return this._variable
	}

	get type(): CtExpr {
		return this._type
	}
}

export class RtFuncDef {
	constructor(
		private readonly _name: string,
		private readonly _params: RtFuncParam[],
		private readonly _resultType: CtExpr,
		private readonly _body: RtMultipleExpr
	) {
		if (!_resultType.ctType.equals(rtTypeCtType)) {
			throw '型じゃない'
		}
	}

	get name(): string {
		return this._name
	}

	get params(): RtFuncParam[] {
		return this._params
	}

	get resultType(): CtExpr {
		return this._resultType
	}

	get body(): RtMultipleExpr {
		return this._body
	}
}
