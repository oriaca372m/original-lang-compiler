import * as p from 'Src/parser'

import {
	builtInBinaryOpApplicatives,
	builtInBinaryOps,
	builtInUnaryOpApplicatives,
} from 'Src/ast/builtin'
import { Ctv, Overload } from 'Src/ast/compile-time'
import { resolveOverload } from 'Src/ast/overload-resolver'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from './define-function'
import { makeExpr, makeExprFromOperand } from './expr'
import { toRValue } from './misc'
import { makeMemberAccess } from './struct'

import * as u from 'Src/utils'

export function makeApplyFunctionFormFunctionCall(
	s: BlockState,
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): nodes.ApplyFunction {
	let funcExpr = makeExprFromInterpretedOperand(s, funcNode)
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

function makeExprFromBinaryOperation(s: BlockState, value: p.BinaryOperation): nodes.Expr {
	const name = value.op.value

	const applicative = builtInBinaryOpApplicatives[name]
	if (applicative !== undefined) {
		return new nodes.Expr(
			new nodes.ApplyApplicative(applicative, [
				makeExprFromInterpretedOperand(s, value.lhs),
				makeExprFromInterpretedOperand(s, value.rhs),
			])
		)
	}

	const func = builtInBinaryOps[name]
	if (func === undefined) {
		throw `unknown binary operator: ${name}`
	}

	return new nodes.Expr(
		new nodes.ApplyFunction(new nodes.Expr(new nodes.ImmediateValue(func)), [
			toRValue(makeExprFromInterpretedOperand(s, value.lhs)),
			toRValue(makeExprFromInterpretedOperand(s, value.rhs)),
		])
	)
}

function makeExprFromUnaryOperation(s: BlockState, value: p.UnaryOperation): nodes.Expr {
	const name = value.op.value

	const applicative = builtInUnaryOpApplicatives[name]
	if (applicative !== undefined) {
		return new nodes.Expr(
			new nodes.ApplyApplicative(applicative, [
				makeExprFromInterpretedOperand(s, value.operand),
			])
		)
	}

	throw `知らない単項演算子: ${name}`
}

function makeExprFromApplySuffix(s: BlockState, value: p.ApplySuffix): nodes.Expr {
	const v = value.suffix.value
	if (v instanceof p.FunctionCallArgument) {
		return new nodes.Expr(makeApplyFunctionFormFunctionCall(s, value.operand, v))
	} else if (v instanceof p.IndexAccess) {
		return new nodes.Expr(
			new nodes.ApplyApplicative(builtInBinaryOpApplicatives['@'], [
				makeExprFromInterpretedOperand(s, value.operand),
				makeExpr(s, v.value),
			])
		)
	} else if (v instanceof p.MemberAccess) {
		return new nodes.Expr(makeMemberAccess(makeExprFromInterpretedOperand(s, value.operand), v))
	} else {
		u.unreachable(v)
	}
}

export function makeExprFromInterpretedOperand(
	s: BlockState,
	iTerm: p.InterpretedOperand
): nodes.Expr {
	const value = iTerm.value
	if (value instanceof p.Operand) {
		return makeExprFromOperand(s, value)
	} else if (value instanceof p.BinaryOperation) {
		return makeExprFromBinaryOperation(s, value)
	} else if (value instanceof p.UnaryOperation) {
		return makeExprFromUnaryOperation(s, value)
	} else if (value instanceof p.ApplySuffix) {
		return makeExprFromApplySuffix(s, value)
	} else {
		u.unreachable(value)
	}
}
