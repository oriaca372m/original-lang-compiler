import { CtType } from 'Src/ct-tree/ct-type'
import { CtImmediateValue } from './ct-immediate-value'
import { CtApplyFunc } from './ct-apply-func'

import * as u from 'Src/utils'

type CtExprType = CtImmediateValue | CtApplyFunc
export class CtExpr {
	constructor(private readonly _value: CtExprType) {}

	get value(): CtExprType {
		return this._value
	}

	get ctType(): CtType {
		return this.value.ctType
	}
}

export class CtMultipleExpr {
	constructor(private readonly _exprs: CtExpr[]) {
		if (_exprs.length === 0) {
			throw '空のCtMultipleExprはだめ'
		}
	}

	get exprs(): CtExpr[] {
		return this._exprs
	}

	private get _last(): CtExpr {
		return u.l.last(this._exprs) ?? u.unreachable()
	}

	get ctType(): CtType {
		return this._last.ctType
	}
}
