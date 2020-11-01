import { Expr } from 'Src/ast/nodes/expr'
import { ImmediateValue } from 'Src/ast/nodes/immediate-value'

import { Ctv } from 'Src/ast/compile-time/ctv'

export function convertCtvToExpr(ctv: Ctv): Expr {
	return new Expr(new ImmediateValue(ctv.value[0]))
}
