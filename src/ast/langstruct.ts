import * as u from 'Src/utils'

import { TypeCore } from 'Src/ast/langtype'

export class StructMember {
	constructor(
		private readonly _name: string,
		private readonly _type: TypeCore,
		private readonly _offset: number
	) {}

	get name(): string {
		return this._name
	}

	get type(): TypeCore {
		return this._type
	}

	get offset(): number {
		return this._offset
	}
}

export class LangStruct {
	private readonly _size: number

	constructor(private readonly _name: string, private readonly _members: StructMember[]) {
		this._size = u.l.sumBy(_members, (x) => x.type.size)
	}

	get name(): string {
		return this._name
	}

	get members(): StructMember[] {
		return this._members
	}

	get size(): number {
		return this._size
	}
}

export class LangStructManager {
	private readonly _map: Map<string, LangStruct> = new Map<string, LangStruct>()

	set(name: string, langStruct: LangStruct): void {
		this._map.set(name, langStruct)
	}

	get(name: string): LangStruct | undefined {
		return this._map.get(name)
	}
}
