import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from '../define-function'
import { makeIf } from '../if'
import { makeWhile, makeBreak } from '../while'
import { makeArrayLiteral } from '../array'
import { makeNewStruct } from '../struct'
import { makeExprFromIdentifier } from '../variable'
import { makeCast } from '../cast'
import { makeExprFromDefFunctionExpr } from '../define-function-expr'

import { makeExpr } from './expr'

function termToExpr(s: BlockState, term: p.Term): nodes.Expr {
	const v = term.value

	if (v instanceof p.NumberNode || v instanceof p.StringNode) {
		return new nodes.Expr(new nodes.ImmediateValue(v.value))
	} else if (v instanceof p.Bracket) {
		return makeExpr(s, v.value)
	} else if (v instanceof p.Identifier) {
		return makeExprFromIdentifier(s, v)
	} else if (v instanceof p.If) {
		return new nodes.Expr(makeIf(s, v))
	} else if (v instanceof p.While) {
		return new nodes.Expr(makeWhile(s, v))
	} else if (v instanceof p.Break) {
		return new nodes.Expr(makeBreak(s))
	} else if (v instanceof p.ArrayLiteral) {
		return new nodes.Expr(makeArrayLiteral(s, v))
	} else if (v instanceof p.NewStruct) {
		return new nodes.Expr(makeNewStruct(s, v))
	} else if (v instanceof p.Cast) {
		return new nodes.Expr(makeCast(s, v))
	} else if (v instanceof p.DefFunctionExpr) {
		return makeExprFromDefFunctionExpr(s, v)
	} else {
		u.unreachable(v)
	}
}

export function operandToExpr(s: BlockState, operand: p.Operand): nodes.Expr {
	const v = operand.value
	if (v instanceof p.Term) {
		return termToExpr(s, v)
	} else {
		u.unreachable(v)
	}
}
