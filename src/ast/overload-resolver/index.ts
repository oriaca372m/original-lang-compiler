import * as u from 'Src/utils'
import { Expr } from 'Src/ast/nodes/expr'
import { LangFunction } from 'Src/ast/langfunction'

function calcScore(candidate: LangFunction, args: Expr[]): number {
	const ok = u.l.zip(candidate.argTypes, args).every(([t, e]) => {
		if (t === undefined || e === undefined) {
			return false
		}

		return t.equals(e.type.core)
	})

	return ok ? 1 : 0
}

export function resolveOverload(candidates: LangFunction[], args: Expr[]): LangFunction {
	for (const candidate of candidates) {
		if (calcScore(candidate, args) === 1) {
			return candidate
		}
	}

	throw 'マッチするオーバーロード候補がない'
}
