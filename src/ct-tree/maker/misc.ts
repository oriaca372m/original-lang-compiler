import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { ctImmediateValueFromIdentifier } from './ct-immediate-value'
import { BlockState } from './states'

export function makeCtExprFromTypeNode(bs: BlockState, pNode: p.TypeNode): nodes.CtExpr {
	const v = pNode.value
	if (v instanceof p.TypeIdentifier) {
		return new nodes.CtExpr(ctImmediateValueFromIdentifier(bs.nameResolver, v))
	} else {
		u.notImplemented()
	}
}
