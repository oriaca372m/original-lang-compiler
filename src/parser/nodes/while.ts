import { Source } from 'Src/parser/source'
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

export function parseWhile(s: Source): While {
	s.forceWord('while')
	s.skipSpaces()

	const cond = parseExpr(s)
	s.skipSpaces()

	const body = parseMultipleStmt(s)
	s.skipSpaces()

	return new While(cond, body)
}

export class Break {}

export function parseBreak(s: Source): Break {
	s.forceWord('break')
	return new Break()
}
