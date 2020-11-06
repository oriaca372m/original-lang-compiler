import * as p from 'Src/parser'
import * as u from 'Src/utils'

import { NameResolver } from 'Src/ast/name'
import { builtInTypes } from 'Src/ast/builtin'
import { TypeCore, FixedArrayType, PointerType } from 'Src/ast/langtype'

function resolveTypeIdentifier(nr: NameResolver, id: p.TypeIdentifier): TypeCore {
	const name = id.value

	const type = builtInTypes[name]
	if (type !== undefined) {
		return type
	}

	const resolved = nr.resolve(name)
	if (resolved !== undefined && resolved.value.kind === 'ct-variable') {
		const ctv = resolved.value.value.value
		if (ctv.value instanceof TypeCore) {
			return ctv.value
		}
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
