import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { ParseError } from 'Src/parser/error'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'

export class LetStmt {
	constructor(private readonly _name: prim.Identifier, private readonly _expr: Expr) {}

	get name(): prim.Identifier {
		return this._name
	}

	get expr(): Expr {
		return this._expr
	}
}

function parseLetStmt(s: Source): LetStmt {
	s.forceWord('let')
	s.skipSpaces()
	const id = prim.parseIdentifier(s)
	s.skipSpaces()
	s.forceSeek('=')
	s.skipSpaces()
	const expr = parseExpr(s)

	return new LetStmt(id, expr)
}

type StmtType = Expr | LetStmt
export class Stmt extends prim.ValueNode<StmtType> {}

export function parseStmt(s: Source): Stmt {
	const letStmt = prim.tryParse(s, parseLetStmt)
	if (letStmt !== undefined) {
		return new Stmt(letStmt)
	}

	const expr = prim.tryParse(s, parseExpr)
	if (expr !== undefined) {
		return new Stmt(expr)
	}

	throw new ParseError(s, "couldn't find a statement.")
}

export class MultipleStmt extends prim.ListNode<Stmt> {}

export function parseMultipleStmt(s: Source): MultipleStmt {
	s.forceSeek('{')
	s.skipRegExp(/[\n\t ]/)

	const stmts: Stmt[] = []
	for (;;) {
		if (s.cch === '}') {
			s.next()
			break
		}

		stmts.push(parseStmt(s))
		s.skipSpaces()

		if (s.cch === '}') {
			s.next()
			break
		}

		s.forceSeek('\n')
		s.skipRegExp(/[\n\t ]/)
	}

	return new MultipleStmt(stmts)
}
