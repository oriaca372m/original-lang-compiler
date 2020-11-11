import * as p from 'Src/parser'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { makeExprFormExpr } from './expr'

export function makeArrayLiteral(s: BlockState, pnode: p.ArrayLiteral): nodes.ArrayLiteral {
	return new nodes.ArrayLiteral(pnode.value.map((x) => makeExprFormExpr(s, x)))
}
