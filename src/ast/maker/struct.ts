import * as p from 'Src/parser'

import { NameResolver } from 'Src/ast/name'
import { LangStruct, StructMember } from 'Src/ast/langstruct'
import { StructType } from 'Src/ast/langtype'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { resolveType } from './resolve-type'

function makeStructMembers(
	nameResolver: NameResolver,
	parserMembers: p.StructMember[]
): StructMember[] {
	const members = []
	let offset = 0

	for (const parserMember of parserMembers) {
		const type = resolveType(nameResolver, parserMember.type)
		members.push(new StructMember(parserMember.name.value, type, offset))
		offset += type.size
	}

	return members
}

export function makeLangStruct(
	nameResolver: NameResolver,
	defineStruct: p.DefineStruct
): LangStruct {
	return new LangStruct(
		defineStruct.name.value,
		makeStructMembers(nameResolver, defineStruct.members)
	)
}

export function makeNewStruct(s: BlockState, parserNode: p.NewStruct): nodes.NewStruct {
	const type = resolveType(s.nameResolver, parserNode.typeNode)

	if (!(type instanceof StructType)) {
		throw '型がstructじゃない'
	}

	return new nodes.NewStruct(type)
}

export function makeMemberAccess(expr: nodes.Expr, parserNode: p.MemberAccess): nodes.MemberAccess {
	return new nodes.MemberAccess(expr, parserNode.value.value)
}
