import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'
import * as prim from 'Src/parser/nodes/primitive'

export class TypeIdentifier extends prim.Identifier {}

function parseTypeIdentifier(s: Source): TypeIdentifier {
	return new TypeIdentifier(prim.force(s.tryToken(/[a-z_]/)))
}

export class FixedArrayType {
	constructor(private readonly _elmType: TypeNode, private readonly _length: number) {}

	get elmType(): TypeNode {
		return this._elmType
	}

	get length(): number {
		return this._length
	}
}

function parseFixedArrayType(s: Source): FixedArrayType | ParseError {
	const err = s.trySeek('[')
	if (prim.isError(err)) {
		return err
	}

	const len = prim.force(prim.parseNumber(s))
	s.forceSeek(']')
	const elmType = parseTypeNode(s)

	return new FixedArrayType(elmType, len.value)
}

export class PointerType {
	constructor(private readonly _elmType: TypeNode) {}

	get elmType(): TypeNode {
		return this._elmType
	}
}

function parsePointerType(s: Source): PointerType | ParseError {
	const err = s.trySeek('*')
	if (prim.isError(err)) {
		return err
	}
	const elmType = parseTypeNode(s)

	return new PointerType(elmType)
}

type TypeNodeType = TypeIdentifier | FixedArrayType | PointerType
export class TypeNode extends prim.ValueNode<TypeNodeType> {}

export function parseTypeNode(s: Source): TypeNode {
	const arr = parseFixedArrayType(s)
	if (prim.isNotError(arr)) {
		return new TypeNode(arr)
	}

	const ptr = parsePointerType(s)
	if (prim.isNotError(ptr)) {
		return new TypeNode(ptr)
	}

	return new TypeNode(parseTypeIdentifier(s))
}
