import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'

import { makeRtExpr } from './rt-expr'
import { interpretedOperandToRtExpr } from './interpreted-operand'
import { BlockState } from '../states'

function functionCallToCtExpr(
	bs: BlockState,
	funcExpr: nodes.CtExpr,
	argsNode: p.FunctionCallArgument
): nodes.CtExpr {
	const args = argsNode.args.value.map((x) => {
		const expr = makeRtExpr(bs, x)
		if (!(expr instanceof nodes.CtExpr)) {
			throw '実行時の式が混ざっている'
		}
		return expr
	})

	return new nodes.CtExpr(new nodes.CtApplyFunc(funcExpr, args))
}

export function functionCallToExpr(
	bs: BlockState,
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): nodes.RtExpr | nodes.CtExpr {
	const funcExpr = interpretedOperandToRtExpr(bs, funcNode)
	if (funcExpr instanceof nodes.CtExpr) {
		return functionCallToCtExpr(bs, funcExpr, argsNode)
	}

	const args = argsNode.args.value.map((x) => {
		const expr = makeRtExpr(bs, x)
		if (expr instanceof nodes.CtExpr) {
			return new nodes.RtExpr(new nodes.RtToRtValue(expr))
		}
		return expr
	})

	return new nodes.RtExpr(new nodes.RtApplyFunc(funcExpr, args))
}
