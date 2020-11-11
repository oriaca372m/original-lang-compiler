import { ValueType } from 'Src/ast/langtype'
import { Applicative } from 'Src/ast/applicative'

import { TypedNode } from './primitive'
import { Expr } from './expr'

export class ApplyApplicative implements TypedNode {
	private readonly _resultType: ValueType
	private readonly _args: Expr[]

	constructor(private readonly _applicative: Applicative, args: Expr[]) {
		const resultType = _applicative.resultType(args.map((x) => x.type))

		if (resultType === undefined) {
			throw '呼び出せないぜそのアプリカティブ'
		}

		this._resultType = resultType
		this._args = _applicative.transformArgs(args)
	}

	get applicative(): Applicative {
		return this._applicative
	}

	get args(): Expr[] {
		return this._args
	}

	get type(): ValueType {
		return this._resultType
	}
}
