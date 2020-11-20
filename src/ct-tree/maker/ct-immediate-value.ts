import * as p from 'Src/parser'

import { RtType } from 'Src/ct-tree/rt-type'
import * as nodes from 'Src/ct-tree/nodes'
import { NameResolver } from './name-resolver'

export function ctImmediateValueFromIdentifier(
	nr: NameResolver,
	pNode: p.Identifier
): nodes.CtImmediateValue {
	const name = pNode.value

	console.log(nr.resolve(name))

	if (name === 'RtInt') {
		return new nodes.CtImmediateValue(new RtType())
	}

	throw 'unknown identifier!'
}
