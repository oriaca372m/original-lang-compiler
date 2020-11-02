import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'
import * as prim from 'Src/parser/nodes/primitive'

import { TypeNode, parseTypeNode } from 'Src/parser/nodes/type'

export class StructMember {
	constructor(private readonly _name: prim.Identifier, private readonly _type: TypeNode) {}

	get name(): prim.Identifier {
		return this._name
	}

	get type(): TypeNode {
		return this._type
	}
}

function parseStructMember(s: Source): StructMember {
	const name = prim.force(prim.parseIdentifier(s))
	s.skipSpaces()
	const type = parseTypeNode(s)
	return new StructMember(name, type)
}

export class DefineStruct {
	constructor(
		private readonly _name: prim.Identifier,
		private readonly _members: StructMember[]
	) {}

	get name(): prim.Identifier {
		return this._name
	}

	get members(): StructMember[] {
		return this._members
	}
}

export function parseDefineStruct(s: Source): DefineStruct | ParseError {
	const err = s.tryWord('struct')
	if (prim.isError(err)) {
		return err
	}
	s.skipSpaces()

	const name = prim.force(prim.parseIdentifier(s))
	s.skipSpaces()

	s.forceSeek('{')
	s.skipRegExp(/[\n\t ]/)

	const members: StructMember[] = []
	for (;;) {
		if (s.cch === '}') {
			s.next()
			break
		}

		members.push(parseStructMember(s))
		s.skipSpaces()

		if (s.cch === '}') {
			s.next()
			break
		}

		s.forceSeek('\n')
		s.skipRegExp(/[\n\t ]/)
	}

	return new DefineStruct(name, members)
}

export class NewStruct {
	constructor(private readonly _typeNode: TypeNode) {}

	get typeNode(): TypeNode {
		return this._typeNode
	}
}

export function parseNewStruct(s: Source): NewStruct | ParseError {
	const err = s.tryWord('newstruct')
	if (prim.isError(err)) {
		return err
	}
	s.skipSpaces()
	const typeNode = parseTypeNode(s)
	s.skipSpaces()
	s.forceSeek('{')
	s.skipSpaces()
	s.forceSeek('}')

	return new NewStruct(typeNode)
}

export class MemberAccess extends prim.ValueNode<prim.Identifier> {}

export function parseMemberAccess(s: Source): MemberAccess | ParseError {
	const err = s.trySeek('.')
	if (prim.isError(err)) {
		return err
	}

	const id = prim.force(prim.parseIdentifier(s))
	return new MemberAccess(id)
}
