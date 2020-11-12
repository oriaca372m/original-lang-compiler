import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { makeCtExpr } from './ct-expr'

function termToCtExpr(term: p.Term): nodes.CtExpr {
	const v = term.value

	if (v instanceof p.NumberNode) {
		return new nodes.CtExpr(new nodes.CtImmediateValue(v.value))
	} else if (v instanceof p.StringNode) {
		u.notImplemented()
	} else if (v instanceof p.Bracket) {
		return makeCtExpr(v.value)
	} else if (v instanceof p.Identifier) {
		u.notImplemented()
	} else if (v instanceof p.If) {
		u.notImplemented()
	} else if (v instanceof p.While) {
		u.notImplemented()
	} else if (v instanceof p.Break) {
		u.notImplemented()
	} else if (v instanceof p.ArrayLiteral) {
		u.notImplemented()
	} else if (v instanceof p.NewStruct) {
		u.notImplemented()
	} else if (v instanceof p.Cast) {
		u.notImplemented()
	} else if (v instanceof p.DefFunctionExpr) {
		u.notImplemented()
	} else {
		u.unreachable(v)
	}
}

export function operandToCtExpr(operand: p.Operand): nodes.CtExpr {
	const v = operand.value
	if (v instanceof p.Term) {
		return termToCtExpr(v)
	} else {
		u.unreachable(v)
	}
}
