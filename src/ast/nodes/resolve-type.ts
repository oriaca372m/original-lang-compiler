import * as p from 'Src/parser'
import * as u from 'Src/utils'

import { NameResolver } from 'Src/ast/name'
import {
	TypeCore,
	FixedArrayType,
	intType,
	stringType,
	voidType,
	PointerType,
} from 'Src/ast/langtype'

function resolveTypeIdentifier(nr: NameResolver, id: p.TypeIdentifier): TypeCore {
	const name = id.value
	const table: { [key: string]: TypeCore } = {
		int: intType,
		string: stringType,
		void: voidType,
	}

	const type = table[name]
	if (type !== undefined) {
		return type
	}

	const resolved = nr.resolve(name)
	if (resolved !== undefined && resolved.value.kind === 'type') {
		return resolved.value.value
	}

	throw `unknown type! ${name}`
}

export function resolveType(nr: NameResolver, typeNode: p.TypeNode): TypeCore {
	const v = typeNode.value
	if (v instanceof p.TypeIdentifier) {
		return resolveTypeIdentifier(nr, v)
	} else if (v instanceof p.FixedArrayType) {
		const elmType = resolveType(nr, v.elmType)
		return new FixedArrayType(elmType, v.length)
	} else if (v instanceof p.PointerType) {
		const elmType = resolveType(nr, v.elmType)
		return new PointerType(elmType)
	} else {
		u.unreachable(v)
	}
}
