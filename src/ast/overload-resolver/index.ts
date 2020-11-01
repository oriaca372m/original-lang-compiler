import * as u from 'Src/utils'
import { Expr } from 'Src/ast/nodes/expr'
import { LangFunction } from 'Src/ast/langfunction'

export function resolveOverload(candidate: LangFunction[], _args: Expr[]): LangFunction {
	if (candidate.length !== 1) {
		u.notImplemented()
	}

	return candidate[0]
}
