import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { makeRtExpr } from './rt-expr'
import { ctImmediateValueFromIdentifier } from '../ct-immediate-value'
import { BlockState } from '../states'

function termToRtExpr(bs: BlockState, term: p.Term): nodes.RtExpr | nodes.CtExpr {
	const v = term.value

	if (v instanceof p.NumberNode) {
		return new nodes.CtExpr(new nodes.CtImmediateValue(v.value))
	} else if (v instanceof p.StringNode) {
		u.notImplemented()
	} else if (v instanceof p.Bracket) {
		return makeRtExpr(bs, v.value)
	} else if (v instanceof p.Identifier) {
		return new nodes.CtExpr(ctImmediateValueFromIdentifier(bs.nameResolver, v))
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

export function operandToRtExpr(bs: BlockState, operand: p.Operand): nodes.RtExpr | nodes.CtExpr {
	const v = operand.value
	if (v instanceof p.Term) {
		return termToRtExpr(bs, v)
	} else {
		u.unreachable(v)
	}
}
