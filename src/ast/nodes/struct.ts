import * as p from 'Src/parser'

import { NameResolver } from 'Src/ast/name'
import { LangStruct, StructMember } from 'Src/ast/langstruct'
import { ValueType, StructType, rValue } from 'Src/ast/langtype'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { resolveType } from 'Src/ast/nodes/resolve-type'
import { Expr } from 'Src/ast/nodes/expr'

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

export class NewStruct implements prim.TypedNode {
	constructor(private readonly _core: StructType) {
		if (_core.langStruct === undefined) {
			throw 'サイズが決まっていない型はnewstructできない'
		}
	}

	get type(): ValueType<StructType> {
		return new ValueType(this._core, rValue)
	}
}

export function makeNewStruct(s: BlockState, parserNode: p.NewStruct): NewStruct {
	const type = resolveType(s.nameResolver, parserNode.typeNode)

	if (!(type instanceof StructType)) {
		throw '型がstructじゃない'
	}

	return new NewStruct(type)
}

export class MemberAccess implements prim.TypedNode {
	private readonly _member: StructMember

	constructor(private readonly _expr: Expr, memberName: string) {
		const core = _expr.type.core
		if (!(core instanceof StructType)) {
			throw 'structじゃない'
		}

		if (core.langStruct === undefined) {
			throw '不完全型はだめ'
		}

		const member = core.langStruct.members.find((x) => x.name === memberName)
		if (member === undefined) {
			throw `そんな名前のメンバーはない: ${memberName}`
		}

		this._member = member
	}

	get expr(): Expr {
		return this._expr
	}

	get member(): StructMember {
		return this._member
	}

	get type(): ValueType {
		return this._expr.type.withCore(this._member.type)
	}
}

export function makeMemberAccess(expr: Expr, parserNode: p.MemberAccess): MemberAccess {
	return new MemberAccess(expr, parserNode.value.value)
}
