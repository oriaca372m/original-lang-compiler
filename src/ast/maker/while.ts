import * as p from 'Src/parser'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { makeExprFormExpr, makeMultipleExpr } from './expr'

export function makeWhile(s: BlockState, whileNode: p.While): nodes.While {
	const node = new nodes.While()
	const oldWhile = s.dfs.currentWhile
	s.dfs.currentWhile = node
	node.init(makeExprFormExpr(s, whileNode.cond), makeMultipleExpr(s, whileNode.body))
	s.dfs.currentWhile = oldWhile
	return node
}

export function makeBreak(s: BlockState): nodes.Break {
	if (s.dfs.currentWhile === undefined) {
		throw 'breakはwhileの中で使うべし'
	}

	return new nodes.Break(s.dfs.currentWhile)
}
