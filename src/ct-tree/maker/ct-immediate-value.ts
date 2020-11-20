import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { NameResolver, NameValueCtImm } from './name-resolver'

export function ctImmediateValueFromIdentifier(
	nr: NameResolver,
	pNode: p.Identifier
): nodes.CtImmediateValue {
	const name = pNode.value
	const nameValue = nr.resolve(name)?.value

	if (nameValue instanceof NameValueCtImm) {
		return nameValue.ctImm
	}

	throw 'unknown identifier!'
}
