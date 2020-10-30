import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { ParseError } from 'Src/parser/error'
import { Term, parseTerm } from 'Src/parser/nodes/term'
import { IndexAccess, parseIndexAccess } from 'Src/parser/nodes/array'
import { MemberAccess, parseMemberAccess } from 'Src/parser/nodes/struct'

export class FunctionCallArgument {
	constructor(private readonly _args: prim.ListNode<Expr>) {}

	get args(): prim.ListNode<Expr> {
		return this._args
	}
}

function parseFunctionCallArgument(s: Source): FunctionCallArgument {
	s.forceSeek('(')
	let first = true

	const list = []
	for (;;) {
		s.skipSpaces()
		if (s.cch === ')') {
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

	return new FunctionCallArgument(new prim.ListNode(list))
}

export class Operator extends prim.Identifier {}

function parseOperator(s: Source): Operator {
	const op = s.getToken(/[-+*/=<@&]/)
	return new Operator(op)
}

type OperandType = Term
export class Operand extends prim.ValueNode<OperandType> {
	// TODO: どうもTypeScriptの型チェックがガバガバなののワークアラウンド
	_className_Operand: undefined
}

function parseOperand(s: Source): Operand {
	const term = parseTerm(s)
	return new Operand(term)
}

type SuffixType = FunctionCallArgument | IndexAccess | MemberAccess
export class Suffix extends prim.ValueNode<SuffixType> {
	constructor(private readonly _name: string, value: SuffixType) {
		super(value)
	}

	get name(): string {
		return this._name
	}
}

function parseSuffix(s: Source): Suffix {
	const indexAccess = prim.tryParse(s, parseIndexAccess)
	if (indexAccess !== undefined) {
		return new Suffix('IndexAccess', indexAccess)
	}

	const memberAccess = prim.tryParse(s, parseMemberAccess)
	if (memberAccess !== undefined) {
		return new Suffix('MemberAccess', memberAccess)
	}

	const funcArgs = prim.tryParse(s, parseFunctionCallArgument)
	if (funcArgs !== undefined) {
		return new Suffix('FunctionCallArgument', funcArgs)
	}

	throw 'suffixではない'
}

export type ExprType = Operand | Operator | Suffix
export class Expr extends prim.ListNode<ExprType> {}

export function parseExpr(s: Source): Expr {
	const result: ExprType[] = []
	for (;;) {
		for (;;) {
			const op = prim.tryParse(s, parseOperator)
			if (op === undefined) {
				break
			}

			result.push(op)
			s.skipSpaces()
		}

		const operand = prim.tryParse(s, parseOperand)
		if (operand === undefined) {
			break
		}
		result.push(operand)
		s.skipSpaces()

		for (;;) {
			const suffix = prim.tryParse(s, parseSuffix)
			if (suffix === undefined) {
				break
			}

			result.push(suffix)
			s.skipSpaces()
		}
	}

	if (result.length === 0) {
		throw new ParseError(s, 'empty expr.')
	}
	return new Expr(result)
}
