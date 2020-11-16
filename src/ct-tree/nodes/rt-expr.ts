import { RtApplyFunc } from './rt-apply-func'
import { RtToRtValue } from './rt-to-rt-value'
import { CtExpr, CtMultipleExpr } from './ct-expr'

type RtExprType = RtToRtValue | RtApplyFunc
export class RtExpr {
	constructor(private readonly _value: RtExprType) {}

	get value(): RtExprType {
		return this._value
	}
}

export class RtDoCtExpr {
	constructor(private readonly _value: CtExpr) {}

	get value(): CtExpr {
		return this._value
	}
}

type RtMultipleExprType = (RtExpr | RtDoCtExpr)[]
export class RtMultipleExpr {
	constructor(private readonly _exprs: RtMultipleExprType) {
		if (_exprs.length === 0) {
			throw '空のRtMultipleExprはだめ'
		}
	}

	get exprs(): RtMultipleExprType {
		return this._exprs
	}

	toCtMultipleExpr(): CtMultipleExpr | undefined {
		const ctExprs = []

		for (const expr of this.exprs) {
			if (expr instanceof RtDoCtExpr) {
				ctExprs.push(expr.value)
			} else {
				return
			}
		}

		return new CtMultipleExpr(ctExprs)
	}
}
