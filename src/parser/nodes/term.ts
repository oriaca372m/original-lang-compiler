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

function parseBracket(s: Source): Bracket {
	s.forceSeek('(')
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

export function parseTerm(s: Source): Term {
	const ifNode = prim.tryParse(s, parseIf)
	if (ifNode !== undefined) {
		return new Term(ifNode)
	}

	const whileNode = prim.tryParse(s, parseWhile)
	if (whileNode !== undefined) {
		return new Term(whileNode)
	}

	const breakNode = prim.tryParse(s, parseBreak)
	if (breakNode !== undefined) {
		return new Term(breakNode)
	}

	const newStructNode = prim.tryParse(s, parseNewStruct)
	if (newStructNode !== undefined) {
		return new Term(newStructNode)
	}

	const cast = prim.tryParse(s, parseCast)
	if (cast !== undefined) {
		return new Term(cast)
	}

	const arrayLiteral = prim.tryParse(s, parseArrayLiteral)
	if (arrayLiteral !== undefined) {
		return new Term(arrayLiteral)
	}

	const number = prim.tryParse(s, prim.parseNumber)
	if (number !== undefined) {
		return new Term(number)
	}

	const str = prim.tryParse(s, prim.parseString)
	if (str !== undefined) {
		return new Term(str)
	}

	const variable = prim.tryParse(s, prim.parseVariable)
	if (variable !== undefined) {
		return new Term(variable)
	}

	const bracket = prim.tryParse(s, parseBracket)
	if (bracket !== undefined) {
		return new Term(bracket)
	}

	throw new ParseError(s, "couldn't find a term")
}
