import * as p from 'Src/parser'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { makeExpr } from './expr'
import { resolveType } from './resolve-type'
import { toRValue } from './misc'

export function makeCast(s: BlockState, parserNode: p.Cast): nodes.Cast {
	return new nodes.Cast(
		toRValue(makeExpr(s, parserNode.expr)),
		resolveType(s.nameResolver, parserNode.toType)
	)
}
