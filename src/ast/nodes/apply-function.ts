import * as p from 'Src/parser'

import { ValueType, FunctionType, rValue } from 'Src/ast/langtype'
import {
	builtInBinaryOpApplicatives,
	builtInBinaryOps,
	builtInUnaryOpApplicatives,
} from 'Src/ast/builtin'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { Expr, makeExprFormExpr, makeExprFromOperand } from 'Src/ast/nodes/expr'
import { toRValue } from 'Src/ast/nodes/misc'
import { ApplyApplicative } from 'Src/ast/nodes/apply-applicative'
import { ImmediateValue } from 'Src/ast/nodes/immediate-value'
import { makeMemberAccess } from 'Src/ast/nodes/struct'
import { Ctv, convertCtvToExpr } from 'Src/ast/compile-time'

import * as u from 'Src/utils'

export class ApplyFunction implements prim.TypedNode {
	private readonly _typeCore: FunctionType

	constructor(private readonly _funcExpr: Expr, private readonly _args: Expr[]) {
		const core = _funcExpr.type.core
		if (!(core instanceof FunctionType && _funcExpr.type.vc.isRValue)) {
			throw '関数型じゃない or rvalueじゃない'
		}

		this._typeCore = core

		const ok = u.l.zip(core.argTypes, _args).every(([t, e]) => {
			if (t === undefined || e === undefined) {
				return false
			}

			if (!e.type.vc.isRValue) {
				return false
			}

			return t.equals(e.type.core)
		})

		if (!ok) {
			throw '型チェックでアウトー'
		}
	}

	get funcExpr(): Expr {
		return this._funcExpr
	}

	get funcType(): FunctionType {
		return this._typeCore
	}

	get args(): Expr[] {
		return this._args
	}

	get type(): ValueType {
		return new ValueType(this._typeCore.resultType, rValue)
	}
}

export function makeApplyFunctionFormFunctionCall(
	s: BlockState,
	funcNode: p.InterpretedOperand,
	argsNode: p.FunctionCallArgument
): ApplyFunction {
	let funcExpr = makeExprFromInterpretedOperand(s, funcNode)
	if (funcExpr.value instanceof Ctv) {
		funcExpr = convertCtvToExpr(funcExpr.value)
	}

	return new ApplyFunction(
		toRValue(funcExpr),
		argsNode.args.value.map((x) => toRValue(makeExprFormExpr(s, x)))
	)
}

function makeExprFromBinaryOperation(s: BlockState, value: p.BinaryOperation): Expr {
	const name = value.op.value

	const applicative = builtInBinaryOpApplicatives[name]
	if (applicative !== undefined) {
		return new Expr(
			new ApplyApplicative(applicative, [
				makeExprFromInterpretedOperand(s, value.lhs),
				makeExprFromInterpretedOperand(s, value.rhs),
			])
		)
	}

	const func = builtInBinaryOps[name]
	if (func === undefined) {
		throw `unknown binary operator: ${name}`
	}

	return new Expr(
		new ApplyFunction(new Expr(new ImmediateValue(func)), [
			toRValue(makeExprFromInterpretedOperand(s, value.lhs)),
			toRValue(makeExprFromInterpretedOperand(s, value.rhs)),
		])
	)
}

function makeExprFromUnaryOperation(s: BlockState, value: p.UnaryOperation): Expr {
	const name = value.op.value

	const applicative = builtInUnaryOpApplicatives[name]
	if (applicative !== undefined) {
		return new Expr(
			new ApplyApplicative(applicative, [makeExprFromInterpretedOperand(s, value.operand)])
		)
	}

	throw `知らない単項演算子: ${name}`
}

function makeExprFromApplySuffix(s: BlockState, value: p.ApplySuffix): Expr {
	const v = value.suffix.value
	if (v instanceof p.FunctionCallArgument) {
		return new Expr(makeApplyFunctionFormFunctionCall(s, value.operand, v))
	} else if (v instanceof p.IndexAccess) {
		return new Expr(
			new ApplyApplicative(builtInBinaryOpApplicatives['@'], [
				makeExprFromInterpretedOperand(s, value.operand),
				makeExprFormExpr(s, v.value),
			])
		)
	} else if (v instanceof p.MemberAccess) {
		return new Expr(makeMemberAccess(makeExprFromInterpretedOperand(s, value.operand), v))
	} else {
		u.unreachable(v)
	}
}

export function makeExprFromInterpretedOperand(s: BlockState, iTerm: p.InterpretedOperand): Expr {
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
