import { StructMember } from 'Src/ast/langstruct'
import { ValueType, StructType, rValue } from 'Src/ast/langtype'

import { TypedNode } from './primitive'
import { Expr } from './expr'

export class NewStruct implements TypedNode {
	constructor(private readonly _core: StructType) {
		if (_core.langStruct === undefined) {
			throw 'サイズが決まっていない型はnewstructできない'
		}
	}

	get type(): ValueType<StructType> {
		return new ValueType(this._core, rValue)
	}
}

export class MemberAccess implements TypedNode {
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
