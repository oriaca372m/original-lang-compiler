import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { ctImmediateValueFromIdentifier } from './ct-immediate-value'

export function makeCtExprFromTypeNode(pNode: p.TypeNode): nodes.CtExpr {
	const v = pNode.value
	if (v instanceof p.TypeIdentifier) {
		return new nodes.CtExpr(ctImmediateValueFromIdentifier(v))
	} else {
		u.notImplemented()
	}
}
