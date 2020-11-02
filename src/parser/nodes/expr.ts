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

function parseFunctionCallArgument(s: Source): FunctionCallArgument | ParseError {
	const err = s.trySeek('(')
	if (prim.isError(err)) {
		return err
	}

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

function parseOperator(s: Source): Operator | ParseError {
	return prim.map(s.tryToken(/[-+*/=<@&]/), (x) => new Operator(x))
}

type OperandType = Term
export class Operand extends prim.ValueNode<OperandType> {
	// TODO: どうもTypeScriptの型チェックがガバガバなののワークアラウンド
	_className_Operand: undefined
}

function parseOperand(s: Source): Operand | ParseError {
	return prim.map(parseTerm(s), (x) => new Operand(x))
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

function parseSuffix(s: Source): Suffix | ParseError {
	const indexAccess = prim.tryParse(s, parseIndexAccess)
	if (prim.isNotError(indexAccess)) {
		return new Suffix('IndexAccess', indexAccess)
	}

	const memberAccess = prim.tryParse(s, parseMemberAccess)
	if (prim.isNotError(memberAccess)) {
		return new Suffix('MemberAccess', memberAccess)
	}

	const funcArgs = prim.tryParse(s, parseFunctionCallArgument)
	if (prim.isNotError(funcArgs)) {
		return new Suffix('FunctionCallArgument', funcArgs)
	}

	return new ParseError(s, 'suffixではない')
}

export type ExprType = Operand | Operator | Suffix
export class Expr extends prim.ListNode<ExprType> {}

export function parseExpr(s: Source): Expr {
	const result: ExprType[] = []
	for (;;) {
		for (;;) {
			const op = prim.tryParse(s, parseOperator)
			if (prim.isError(op)) {
				break
			}

			result.push(op)
			s.skipSpaces()
		}

		const operand = prim.tryParse(s, parseOperand)
		if (prim.isError(operand)) {
			break
		}
		result.push(operand)
		s.skipSpaces()

		for (;;) {
			const suffix = prim.tryParse(s, parseSuffix)
			if (prim.isError(suffix)) {
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
