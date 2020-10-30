import { ValueType } from 'Src/ast/langtype'

export interface Node {
	inspect(): string
}

export interface TypedNode {
	type: ValueType
}

export class ValueNode<T> {
	constructor(private readonly _value: T) {}
	get value(): T {
		return this._value
	}
}

export class TypedValueNode<T extends TypedNode> extends ValueNode<T> implements TypedNode {
	get type(): ValueType {
		return this.value.type
	}
}
