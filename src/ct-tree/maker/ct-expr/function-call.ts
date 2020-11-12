import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'

import { makeCtExpr } from './ct-expr'
import { interpretedOperandToCtExpr } from './interpreted-operand'

export function functionCallToCtApplyFunc(
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): nodes.CtApplyFunc {
	const funcExpr = interpretedOperandToCtExpr(funcNode)
	const args = argsNode.args.value.map((x) => makeCtExpr(x))

	return new nodes.CtApplyFunc(funcExpr, args)
}
