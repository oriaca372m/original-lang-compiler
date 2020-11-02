import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'
import * as prim from 'Src/parser/nodes/primitive'
import { MultipleStmt, parseMultipleStmt } from 'Src/parser/nodes/stmt'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'

export class While {
	constructor(private readonly _cond: Expr, private readonly _body: MultipleStmt) {}

	get cond(): Expr {
		return this._cond
	}

	get body(): MultipleStmt {
		return this._body
	}
}

export function parseWhile(s: Source): While | ParseError {
	const err = s.tryWord('while')
	if (prim.isError(err)) {
		return err
	}
	s.skipSpaces()

	const cond = parseExpr(s)
	s.skipSpaces()

	const body = prim.force(parseMultipleStmt(s))
	s.skipSpaces()

	return new While(cond, body)
}

export class Break {}

export function parseBreak(s: Source): Break | ParseError {
	return prim.map(s.tryWord('break'), () => new Break())
}
