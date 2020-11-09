import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { ParseError } from 'Src/parser/error'
import { If, parseIf } from 'Src/parser/nodes/if'
import { While, parseWhile, Break, parseBreak } from 'Src/parser/nodes/while'
import { ArrayLiteral, parseArrayLiteral } from 'Src/parser/nodes/array'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'
import { NewStruct, parseNewStruct } from 'Src/parser/nodes/struct'
import { Cast, parseCast } from 'Src/parser/nodes/cast'
import { DefFunctionExpr, parseDefFunctionExpr } from 'Src/parser/nodes/define-function-expr'

export class Bracket extends prim.ValueNode<Expr> {}

function parseBracket(s: Source): Bracket | ParseError {
	const err = s.trySeek('(')
	if (prim.isError(err)) {
		return err
	}

	s.skipSpaces()
	const expr = parseExpr(s)
	s.skipSpaces()
	s.forceSeek(')')

	return new Bracket(expr)
}

type TermType =
	| prim.NumberNode
	| prim.StringNode
	| prim.Identifier
	| Bracket
	| If
	| While
	| Break
	| ArrayLiteral
	| NewStruct
	| Cast
	| DefFunctionExpr
export class Term extends prim.ValueNode<TermType> {
	// TODO: どうもTypeScriptの型チェックがガバガバなののワークアラウンド
	_className_Term: undefined
}

export function parseTerm(s: Source): Term | ParseError {
	const v = prim.getFirst(s, [
		(s) => prim.map(parseIf(s), (x) => new Term(x)),
		(s) => prim.map(parseWhile(s), (x) => new Term(x)),
		(s) => prim.map(parseBreak(s), (x) => new Term(x)),
		(s) => prim.map(parseNewStruct(s), (x) => new Term(x)),
		(s) => prim.map(parseCast(s), (x) => new Term(x)),
		(s) => prim.map(parseDefFunctionExpr(s), (x) => new Term(x)),
		(s) => prim.map(parseArrayLiteral(s), (x) => new Term(x)),
		(s) => prim.map(prim.parseNumber(s), (x) => new Term(x)),
		(s) => prim.map(prim.parseString(s), (x) => new Term(x)),
		(s) => prim.map(prim.parseIdentifier(s), (x) => new Term(x)),
		(s) => prim.map(parseBracket(s), (x) => new Term(x)),
	])

	return v ?? new ParseError(s, "couldn't find a term")
}
