export class LinkedListItem<T> {
	constructor(
		private _value: T | undefined = undefined,
		private _left: LinkedListItem<T> | undefined = undefined,
		private _right: LinkedListItem<T> | undefined = undefined
	) {}

	conj(value: T): LinkedListItem<T> {
		const node = new LinkedListItem(value, this)
		this._right = node
		return node
	}

	setRight(node: undefined): undefined
	setRight(node: LinkedListItem<T>): LinkedListItem<T>
	setRight(node: LinkedListItem<T> | undefined): LinkedListItem<T> | undefined
	setRight(node: LinkedListItem<T> | undefined): LinkedListItem<T> | undefined {
		this._right = node
		if (node === undefined) {
			return undefined
		}

		node._left = this
		return node
	}

	get value(): T | undefined {
		return this._value
	}

	get left(): LinkedListItem<T> | undefined {
		return this._left
	}

	get right(): LinkedListItem<T> | undefined {
		return this._right
	}

	toArray(): T[] {
		const res: T[] = []
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let node: LinkedListItem<T> | undefined = this
		while (node !== undefined) {
			if (node.value !== undefined) {
				res.push(node.value)
			}

			node = node.right
		}

		return res
	}

	static fromArray<T>(arr: T[]): LinkedListItem<T> {
		const first = new LinkedListItem<T>()
		let node = first
		for (const i of arr) {
			node = node.conj(i)
		}
		return first
	}
}
