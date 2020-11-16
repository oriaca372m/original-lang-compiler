import * as p from 'Src/parser'
import * as u from 'Src/utils'

import { CtType, intCtType, rtTypeCtType } from 'Src/ct-tree/ct-type'

function resolveCtTypeIdentifier(id: p.TypeIdentifier): CtType {
	const name = id.value
	if (name === 'Int') {
		return intCtType
	}

	if (name === 'Type') {
		return rtTypeCtType
	}

	throw `unknown ct-type! ${name}`
}

export function resolveCtType(typeNode: p.TypeNode): CtType {
	const v = typeNode.value
	if (v instanceof p.TypeIdentifier) {
		return resolveCtTypeIdentifier(v)
	} else {
		u.notImplemented()
	}
}
