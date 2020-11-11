import * as p from 'Src/parser'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { makeExpr, makeMultipleExpr } from './expr'

export function makeIf(s: BlockState, ifNode: p.If): nodes.If {
	return new nodes.If(
		makeExpr(s, ifNode.cond),
		makeMultipleExpr(s, ifNode.body),
		ifNode.elseBody === undefined ? undefined : makeMultipleExpr(s, ifNode.elseBody)
	)
}
