import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'

export function isError<T>(value: T | ParseError): value is ParseError {
	return value instanceof ParseError
}

export function isNotError<T>(
	value: T | ParseError,
	func: ((v: T) => void) | undefined = undefined
): value is T {
	if (!(value instanceof ParseError)) {
		if (func) {
			func(value)
		}
		return true
	}

	return false
}

export function map<T, U>(value: T | ParseError, map: (v: T) => U | ParseError): U | ParseError {
	if (value instanceof ParseError) {
		return value
	}

	return map(value)
}

export function force<T>(value: T | ParseError): T {
	if (value instanceof ParseError) {
		throw value
	}

	return value
}

export function getFirst<T>(s: Source, parsers: ((s: Source) => T | ParseError)[]): T | undefined {
	for (const parser of parsers) {
		const val = parser(s)
		if (isNotError(val)) {
			return val
		}
	}
}

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

export function parseIdentifier(s: Source): Identifier | ParseError {
	return map(s.tryToken(/[a-z_]/), (x) => new Identifier(x))
}

export class NumberNode {
	constructor(private readonly _value: number) {}

	get value(): number {
		return this._value
	}
}

export function parseNumber(s: Source): NumberNode | ParseError {
	return map(s.tryToken(/\d/), (x) => new NumberNode(parseInt(x, 10)))
}

export class StringNode {
	constructor(private readonly _value: string) {}

	get value(): string {
		return this._value
	}
}

export function parseString(s: Source): StringNode | ParseError {
	const err = s.trySeek("'")
	if (isError(err)) {
		return err
	}

	let str = ''
	isNotError(s.tryToken(/[^']/), (token) => {
		str = token
	})

	force(s.trySeek("'"))
	return new StringNode(str)
}
