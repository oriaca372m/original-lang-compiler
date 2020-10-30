import { Source } from 'Src/parser/source'

export abstract class ValueNode<T> {
	constructor(private readonly _value: T) {}

	get value(): T {
		return this._value
	}
}

export class ListNode<T> extends ValueNode<T[]> {}

export class Identifier {
	constructor(private readonly _value: string) {}

	get value(): string {
		return this._value
	}
}

export function parseIdentifier(s: Source): Identifier {
	return new Identifier(s.getToken(/[a-z_]/))
}

export class Variable extends Identifier {}

export function parseVariable(s: Source): Variable {
	return new Variable(s.getToken(/[a-z_]/))
}

export class TypeIdentifier extends Identifier {}

export function parseTypeIdentifier(s: Source): TypeIdentifier {
	return new TypeIdentifier(s.getToken(/[a-z_]/))
}

export class NumberNode {
	constructor(private readonly _value: number) {}

	get value(): number {
		return this._value
	}
}

export function parseNumber(s: Source): NumberNode {
	const number = s.getToken(/\d/)
	return new NumberNode(parseInt(number, 10))
}

export class StringNode {
	constructor(private readonly _value: string) {}

	get value(): string {
		return this._value
	}
}

export function parseString(s: Source): StringNode {
	s.forceSeek("'")
	let str = ''
	try {
		str = s.getToken(/[^']/)
	} catch (e) {
		// pass
	}
	s.forceSeek("'")
	return new StringNode(str)
}

export function tryParse<T>(s: Source, parser: (s: Source) => T): T | undefined {
	const s2 = s.clone()
	try {
		const v = parser(s2)
		s.update(s2)
		return v
	} catch {
		return undefined
	}
}
