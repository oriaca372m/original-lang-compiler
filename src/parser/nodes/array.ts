import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'
import * as prim from 'Src/parser/nodes/primitive'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'

export class ArrayLiteral extends prim.ListNode<Expr> {}

export function parseArrayLiteral(s: Source): ArrayLiteral | ParseError {
	const err = s.trySeek('[')
	if (prim.isError(err)) {
		return err
	}

	let first = true

	const list = []
	for (;;) {
		s.skipSpaces()
		if (s.cch === ']') {
			s.next()
			break
		}

		if (first) {
			first = false
		} else {
			s.forceSeek(',')
			s.skipSpaces()
		}

		list.push(parseExpr(s))
	}

	return new ArrayLiteral(list)
}

export class IndexAccess extends prim.ValueNode<Expr> {}

export function parseIndexAccess(s: Source): IndexAccess | ParseError {
	const err = s.trySeek('[')
	if (prim.isError(err)) {
		return err
	}

	s.skipSpaces()
	const expr = parseExpr(s)
	s.skipSpaces()
	s.forceSeek(']')
	return new IndexAccess(expr)
}
