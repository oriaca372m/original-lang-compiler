import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'

export class ArrayLiteral extends prim.ListNode<Expr> {}

export function parseArrayLiteral(s: Source): ArrayLiteral {
	s.forceSeek('[')

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

export function parseIndexAccess(s: Source): IndexAccess {
	s.forceSeek('[')
	s.skipSpaces()
	const expr = parseExpr(s)
	s.skipSpaces()
	s.forceSeek(']')
	return new IndexAccess(expr)
}
