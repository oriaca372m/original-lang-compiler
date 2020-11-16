import { RtExpr } from './rt-expr'

export class RtApplyFunc {
	constructor(private readonly _funcExpr: RtExpr, private readonly _args: RtExpr[]) {}

	get funcExpr(): RtExpr {
		return this._funcExpr
	}

	get args(): RtExpr[] {
		return this._args
	}
}
