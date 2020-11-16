import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'

import { makeRtExpr } from './rt-expr'
import { interpretedOperandToRtExpr } from './interpreted-operand'

export function functionCallToExpr(
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): nodes.RtExpr | nodes.CtExpr {
	const funcExpr = (() => {
		const expr = interpretedOperandToRtExpr(funcNode)
		if (expr instanceof nodes.CtExpr) {
			return new nodes.RtExpr(new nodes.RtToRtValue(expr))
		}
		return expr
	})()

	const args = argsNode.args.value.map((x) => {
		const expr = makeRtExpr(x)
		if (expr instanceof nodes.CtExpr) {
			return new nodes.RtExpr(new nodes.RtToRtValue(expr))
		}
		return expr
	})

	return new nodes.RtExpr(new nodes.RtApplyFunc(funcExpr, args))
}
