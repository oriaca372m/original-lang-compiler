import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'

import { makeRtExpr } from './rt-expr'
import { interpretedOperandToRtExpr } from './interpreted-operand'
import { BlockState } from '../states'

export function functionCallToExpr(
	bs: BlockState,
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): nodes.RtExpr | nodes.CtExpr {
	const funcExpr = (() => {
		const expr = interpretedOperandToRtExpr(bs, funcNode)
		if (expr instanceof nodes.CtExpr) {
			return new nodes.RtExpr(new nodes.RtToRtValue(expr))
		}
		return expr
	})()

	const args = argsNode.args.value.map((x) => {
		const expr = makeRtExpr(bs, x)
		if (expr instanceof nodes.CtExpr) {
			return new nodes.RtExpr(new nodes.RtToRtValue(expr))
		}
		return expr
	})

	return new nodes.RtExpr(new nodes.RtApplyFunc(funcExpr, args))
}
