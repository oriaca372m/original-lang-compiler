import * as u from 'Src/utils'

import { CtType, CtFuncType } from 'Src/ct-tree/ct-type'
import { CtExpr } from './ct-expr'

export class CtApplyFunc {
	private readonly _funcType: CtFuncType

	constructor(private readonly _funcExpr: CtExpr, private readonly _args: CtExpr[]) {
		const core = _funcExpr.ctType
		if (!(core instanceof CtFuncType)) {
			throw '関数型じゃない'
		}

		this._funcType = core

		const ok = u.l.zip(core.argTypes, _args).every(([t, e]) => {
			if (t === undefined || e === undefined) {
				return false
			}

			return t.equals(e.ctType)
		})

		if (!ok) {
			throw '型チェックでアウトー'
		}
	}

	get funcExpr(): CtExpr {
		return this._funcExpr
	}

	get funcType(): CtFuncType {
		return this._funcType
	}

	get args(): CtExpr[] {
		return this._args
	}

	get ctType(): CtType {
		return this.funcType.resultType
	}
}
