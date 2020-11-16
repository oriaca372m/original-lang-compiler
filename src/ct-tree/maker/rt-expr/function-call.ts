import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'

import { makeRtExpr } from './rt-expr'
import { interpretedOperandToRtExpr } from './interpreted-operand'

export function functionCallToExpr(
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): nodes.RtExpr | nodes.CtExpr {
	const funcExpr = interpretedOperandToRtExpr(funcNode)
	const args = argsNode.args.value.map((x) => makeRtExpr(x))

	// return new nodes.RtApplyFunc(funcExpr, args)
	u.notImplemented()
}
