import { CtExpr } from './ct-expr'

export class RtToRtValue {
	constructor(private readonly _value: CtExpr) {}

	get ctValue(): CtExpr {
		return this._value
	}
}
