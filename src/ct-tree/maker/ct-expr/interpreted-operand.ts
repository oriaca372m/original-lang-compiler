import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'

import { operandToCtExpr } from './operand'
import { functionCallToCtApplyFunc } from './function-call'

function applySuffixToCtExpr(value: p.ApplySuffix): nodes.CtExpr {
	const v = value.suffix.value
	if (v instanceof p.FunctionCallArgument) {
		return new nodes.CtExpr(functionCallToCtApplyFunc(value.operand, v))
	} else if (v instanceof p.IndexAccess) {
		u.notImplemented()
	} else if (v instanceof p.MemberAccess) {
		u.notImplemented()
	} else {
		u.unreachable(v)
	}
}

export function interpretedOperandToCtExpr(iTerm: p.InterpretedOperand): nodes.CtExpr {
	const value = iTerm.value
	if (value instanceof p.Operand) {
		return operandToCtExpr(value)
	} else if (value instanceof p.BinaryOperation) {
		u.notImplemented()
	} else if (value instanceof p.UnaryOperation) {
		u.notImplemented()
	} else if (value instanceof p.ApplySuffix) {
		return applySuffixToCtExpr(value)
	} else {
		u.unreachable(value)
	}
}
