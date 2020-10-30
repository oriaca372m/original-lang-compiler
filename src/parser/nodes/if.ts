import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { MultipleStmt, parseMultipleStmt } from 'Src/parser/nodes/stmt'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'

export class If {
	constructor(
		private readonly _cond: Expr,
		private readonly _body: MultipleStmt,
		private readonly _elseBody: MultipleStmt | undefined
	) {}

	get cond(): Expr {
		return this._cond
	}

	get body(): MultipleStmt {
		return this._body
	}

	get elseBody(): MultipleStmt | undefined {
		return this._elseBody
	}
}

export function parseIf(s: Source): If {
	s.forceWord('if')
	s.skipSpaces()

	const cond = parseExpr(s)
	s.skipSpaces()

	const body = parseMultipleStmt(s)
	s.skipSpaces()

	const elseBody = prim.tryParse(s, (s) => {
		s.forceWord('else')
		s.skipSpaces()
		return parseMultipleStmt(s)
	})

	return new If(cond, body, elseBody)
}
