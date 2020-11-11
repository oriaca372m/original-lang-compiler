import * as p from 'Src/parser'

import { Ctv, Overload } from 'Src/ast/compile-time'
import { resolveOverload } from 'Src/ast/overload-resolver'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from '../define-function'
import { toRValue } from '../misc'

import { makeExpr } from './expr'
import { interpretedOperandToExpr } from './interpreted-operand'

export function functionCallToApplyFunction(
	s: BlockState,
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): nodes.ApplyFunction {
	let funcExpr = interpretedOperandToExpr(s, funcNode)
	const args = argsNode.args.value.map((x) => makeExpr(s, x))

	if (funcExpr.value instanceof Ctv) {
		const overload = funcExpr.value.value
		if (overload instanceof Overload) {
			funcExpr = new nodes.Expr(
				new nodes.ImmediateValue(resolveOverload(overload.value, args))
			)
		} else {
			throw '関数じゃない'
		}
	} else {
		funcExpr = toRValue(funcExpr)
	}

	return new nodes.ApplyFunction(
		funcExpr,
		args.map((x) => toRValue(x))
	)
}
