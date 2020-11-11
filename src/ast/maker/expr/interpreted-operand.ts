import * as u from 'Src/utils'
import * as p from 'Src/parser'

import {
	builtInBinaryOpApplicatives,
	builtInBinaryOps,
	builtInUnaryOpApplicatives,
} from 'Src/ast/builtin'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from '../define-function'
import { operandToExpr } from './operand'
import { toRValue } from '../misc'
import { makeMemberAccess } from '../struct'

import { makeExpr } from './expr'
import { functionCallToApplyFunction } from './function-call'

function binaryOperationToExpr(s: BlockState, value: p.BinaryOperation): nodes.Expr {
	const name = value.op.value

	const applicative = builtInBinaryOpApplicatives[name]
	if (applicative !== undefined) {
		return new nodes.Expr(
			new nodes.ApplyApplicative(applicative, [
				interpretedOperandToExpr(s, value.lhs),
				interpretedOperandToExpr(s, value.rhs),
			])
		)
	}

	const func = builtInBinaryOps[name]
	if (func === undefined) {
		throw `unknown binary operator: ${name}`
	}

	return new nodes.Expr(
		new nodes.ApplyFunction(new nodes.Expr(new nodes.ImmediateValue(func)), [
			toRValue(interpretedOperandToExpr(s, value.lhs)),
			toRValue(interpretedOperandToExpr(s, value.rhs)),
		])
	)
}

function unaryOperationToExpr(s: BlockState, value: p.UnaryOperation): nodes.Expr {
	const name = value.op.value

	const applicative = builtInUnaryOpApplicatives[name]
	if (applicative !== undefined) {
		return new nodes.Expr(
			new nodes.ApplyApplicative(applicative, [interpretedOperandToExpr(s, value.operand)])
		)
	}

	throw `知らない単項演算子: ${name}`
}

function applySuffixToExpr(s: BlockState, value: p.ApplySuffix): nodes.Expr {
	const v = value.suffix.value
	if (v instanceof p.FunctionCallArgument) {
		return new nodes.Expr(functionCallToApplyFunction(s, value.operand, v))
	} else if (v instanceof p.IndexAccess) {
		return new nodes.Expr(
			new nodes.ApplyApplicative(builtInBinaryOpApplicatives['@'], [
				interpretedOperandToExpr(s, value.operand),
				makeExpr(s, v.value),
			])
		)
	} else if (v instanceof p.MemberAccess) {
		return new nodes.Expr(makeMemberAccess(interpretedOperandToExpr(s, value.operand), v))
	} else {
		u.unreachable(v)
	}
}

export function interpretedOperandToExpr(s: BlockState, iTerm: p.InterpretedOperand): nodes.Expr {
	const value = iTerm.value
	if (value instanceof p.Operand) {
		return operandToExpr(s, value)
	} else if (value instanceof p.BinaryOperation) {
		return binaryOperationToExpr(s, value)
	} else if (value instanceof p.UnaryOperation) {
		return unaryOperationToExpr(s, value)
	} else if (value instanceof p.ApplySuffix) {
		return applySuffixToExpr(s, value)
	} else {
		u.unreachable(value)
	}
}
