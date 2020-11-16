import { RtApplyFunc } from './rt-apply-func'
import { RtToRtValue } from './rt-to-rt-value'

type RtExprType = RtToRtValue | RtApplyFunc
export class RtExpr {
	constructor(private readonly _value: RtExprType) {}

	get value(): RtExprType {
		return this._value
	}
}

export class RtMultipleExpr {
	constructor(private readonly _exprs: RtExpr[]) {
		if (_exprs.length === 0) {
			throw '空のRtMultipleExprはだめ'
		}
	}

	get exprs(): RtExpr[] {
		return this._exprs
	}
}
