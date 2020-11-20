import * as nodes from 'Src/ct-tree/nodes'

export class Name {
	private readonly _value: NameValue
	constructor(private readonly _nameString: string, value?: NameValue) {
		if (value === undefined) {
			this._value = new NameValueNil()
		} else {
			this._value = value
		}
	}

	get nameString(): string {
		return this._nameString
	}

	get value(): NameValue {
		return this._value
	}
}

export abstract class NameValue {}

export class NameValueCtImm {
	constructor(private readonly _ctImm: nodes.CtImmediateValue) {}

	get ctImm(): nodes.CtImmediateValue {
		return this._ctImm
	}
}

// TODO: とりあえず
export class NameValueNil {}

export class NameResolver {
	private readonly _table = new Set<Name>()
	private readonly _children = new Set<NameResolver>()
	private _parent: NameResolver | undefined

	createChild(): NameResolver {
		const resolver = new NameResolver()

		this._children.add(resolver)
		resolver._parent = this

		return resolver
	}

	get parent(): NameResolver | undefined {
		return this._parent
	}

	get children(): Set<NameResolver> {
		return this._children
	}

	set(name: Name): void {
		if (this.resolveCurrent(name.nameString) !== undefined) {
			throw '二重定義'
		}

		this._table.add(name)
	}

	resolveCurrent(searchString: string): Name | undefined {
		return [...this._table].find((x) => x.nameString === searchString)
	}

	resolve(searchString: string): Name | undefined {
		// 今のスコープで検索
		return this.resolveCurrent(searchString) ?? this.parent?.resolve(searchString)
	}

	getAllCurrent(): Set<Name> {
		return this._table
	}

	getAll(): Set<Name> {
		const res = new Set<Name>()

		for (const v of this._table) {
			res.add(v)
		}

		for (const child of this._children) {
			for (const v of child.getAll()) {
				res.add(v)
			}
		}

		return res
	}
}
