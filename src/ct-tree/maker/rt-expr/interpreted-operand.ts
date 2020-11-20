import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'

import { operandToRtExpr } from './operand'
import { functionCallToExpr } from './function-call'
import { BlockState } from '../states'

function applySuffixToRtExpr(bs: BlockState, value: p.ApplySuffix): nodes.RtExpr | nodes.CtExpr {
	const v = value.suffix.value
	if (v instanceof p.FunctionCallArgument) {
		return functionCallToExpr(bs, value.operand, v)
	} else if (v instanceof p.IndexAccess) {
		u.notImplemented()
	} else if (v instanceof p.MemberAccess) {
		u.notImplemented()
	} else {
		u.unreachable(v)
	}
}

export function interpretedOperandToRtExpr(
	bs: BlockState,
	iTerm: p.InterpretedOperand
): nodes.RtExpr | nodes.CtExpr {
	const value = iTerm.value
	if (value instanceof p.Operand) {
		return operandToRtExpr(bs, value)
	} else if (value instanceof p.BinaryOperation) {
		u.notImplemented()
	} else if (value instanceof p.UnaryOperation) {
		u.notImplemented()
	} else if (value instanceof p.ApplySuffix) {
		return applySuffixToRtExpr(bs, value)
	} else {
		u.unreachable(value)
	}
}
