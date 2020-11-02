import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { ParseError } from 'Src/parser/error'
import { If, parseIf } from 'Src/parser/nodes/if'
import { While, parseWhile, Break, parseBreak } from 'Src/parser/nodes/while'
import { ArrayLiteral, parseArrayLiteral } from 'Src/parser/nodes/array'
import { Expr, parseExpr } from 'Src/parser/nodes/expr'
import { NewStruct, parseNewStruct } from 'Src/parser/nodes/struct'
import { Cast, parseCast } from 'Src/parser/nodes/cast'

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
	| prim.Variable
	| Bracket
	| If
	| While
	| Break
	| ArrayLiteral
	| NewStruct
	| Cast
export class Term extends prim.ValueNode<TermType> {
	// TODO: どうもTypeScriptの型チェックがガバガバなののワークアラウンド
	_className_Term: undefined
}

export function parseTerm(s: Source): Term | ParseError {
	const ifNode = prim.tryParse(s, parseIf)
	if (prim.isNotError(ifNode)) {
		return new Term(ifNode)
	}

	const whileNode = prim.tryParse(s, parseWhile)
	if (prim.isNotError(whileNode)) {
		return new Term(whileNode)
	}

	const breakNode = prim.tryParse(s, parseBreak)
	if (prim.isNotError(breakNode)) {
		return new Term(breakNode)
	}

	const newStructNode = prim.tryParse(s, parseNewStruct)
	if (prim.isNotError(newStructNode)) {
		return new Term(newStructNode)
	}

	const cast = prim.tryParse(s, parseCast)
	if (prim.isNotError(cast)) {
		return new Term(cast)
	}

	const arrayLiteral = prim.tryParse(s, parseArrayLiteral)
	if (prim.isNotError(arrayLiteral)) {
		return new Term(arrayLiteral)
	}

	const number = prim.tryParse(s, prim.parseNumber)
	if (prim.isNotError(number)) {
		return new Term(number)
	}

	const str = prim.tryParse(s, prim.parseString)
	if (prim.isNotError(str)) {
		return new Term(str)
	}

	const variable = prim.tryParse(s, prim.parseVariable)
	if (prim.isNotError(variable)) {
		return new Term(variable)
	}

	const bracket = prim.tryParse(s, parseBracket)
	if (prim.isNotError(bracket)) {
		return new Term(bracket)
	}

	return new ParseError(s, "couldn't find a term")
}
