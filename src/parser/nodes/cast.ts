import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'
import * as prim from 'Src/parser/nodes/primitive'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'
import { TypeNode, parseTypeNode } from 'Src/parser/nodes/type'

export class Cast {
	constructor(private readonly _expr: Expr, private readonly _toType: TypeNode) {}

	get expr(): Expr {
		return this._expr
	}

	get toType(): TypeNode {
		return this._toType
	}
}

export function parseCast(s: Source): Cast | ParseError {
	const err = s.tryWord('cast')
	if (prim.isError(err)) {
		return err
	}

	s.skipSpaces()

	s.forceSeek('<')
	const typeNode = parseTypeNode(s)
	s.forceSeek('>')

	s.forceSeek('(')
	s.skipSpaces()
	const expr = parseExpr(s)
	s.skipSpaces()
	s.forceSeek(')')

	return new Cast(expr, typeNode)
}
