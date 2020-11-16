import * as p from 'Src/parser'

import { RtType } from 'Src/ct-tree/rt-type'
import * as nodes from 'Src/ct-tree/nodes'

export function ctImmediateValueFromIdentifier(pNode: p.Identifier): nodes.CtImmediateValue {
	const name = pNode.value

	if (name === 'RtInt') {
		return new nodes.CtImmediateValue(new RtType())
	}

	throw 'unknown identifier!'
}
