import * as u from 'Src/utils'
import { Expr } from 'Src/ast/nodes/expr'
import { ImmediateValue } from 'Src/ast/nodes/immediate-value'

import { Ctv } from 'Src/ast/compile-time/ctv'
import { Overload } from 'Src/ast/compile-time/overload'

export function convertCtvToExpr(ctv: Ctv): Expr {
	const v = ctv.value
	if (v instanceof Overload) {
		return new Expr(new ImmediateValue(v.value[0]))
	} else {
		u.unreachable()
	}
}
