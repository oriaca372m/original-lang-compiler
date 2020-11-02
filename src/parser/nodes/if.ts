import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'
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

export function parseIf(s: Source): If | ParseError {
	const err = s.tryWord('if')
	if (prim.isError(err)) {
		return err
	}
	s.skipSpaces()

	const cond = parseExpr(s)
	s.skipSpaces()

	const body = prim.force(parseMultipleStmt(s))
	s.skipSpaces()

	let elseBody: MultipleStmt | undefined = undefined
	{
		const err = s.tryWord('else')
		if (prim.isNotError(err)) {
			s.skipSpaces()
			elseBody = prim.force(parseMultipleStmt(s))
		}
	}

	return new If(cond, body, elseBody)
}
