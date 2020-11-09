import { Variable } from 'Src/ast/variable'
import { CtVariable } from 'Src/ast/compile-time'

export type NameValueType = Variable | CtVariable

export class Name {
	constructor(private readonly _nameString: string, private readonly _value: NameValueType) {}

	get nameString(): string {
		return this._nameString
	}

	get value(): NameValueType {
		return this._value
	}
}

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
