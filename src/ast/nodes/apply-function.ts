import { ValueType, FunctionType, rValue } from 'Src/ast/langtype'

import { TypedNode } from './primitive'
import { Expr } from './expr'

import * as u from 'Src/utils'

export class ApplyFunction implements TypedNode {
	private readonly _typeCore: FunctionType

	constructor(private readonly _funcExpr: Expr, private readonly _args: Expr[]) {
		const core = _funcExpr.type.core
		if (!(core instanceof FunctionType && _funcExpr.type.vc.isRValue)) {
			throw '関数型じゃない or rvalueじゃない'
		}

		this._typeCore = core

		const ok = u.l.zip(core.argTypes, _args).every(([t, e]) => {
			if (t === undefined || e === undefined) {
				return false
			}

			if (!e.type.vc.isRValue) {
				return false
			}

			return t.equals(e.type.core)
		})

		if (!ok) {
			throw '型チェックでアウトー'
		}
	}

	get funcExpr(): Expr {
		return this._funcExpr
	}

	get funcType(): FunctionType {
		return this._typeCore
	}

	get args(): Expr[] {
		return this._args
	}

	get type(): ValueType {
		return new ValueType(this._typeCore.resultType, rValue)
	}
}
