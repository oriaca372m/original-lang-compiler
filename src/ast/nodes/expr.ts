import * as p from 'Src/parser'

import { Ctv } from 'Src/ast/compile-time'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { ImmediateValue, makeImmdiateValue } from 'Src/ast/nodes/immediate-value'
import { If, makeIf } from 'Src/ast/nodes/if'
import { While, makeWhile, Break, makeBreak } from 'Src/ast/nodes/while'
import { ArrayLiteral, makeArrayLiteral } from 'Src/ast/nodes/array'
import { makeNewStruct, NewStruct, MemberAccess } from 'Src/ast/nodes/struct'
import {
	VariableRef,
	LetStmt,
	makeExprFromIdentifier,
	makeExprFromLetStmt,
} from 'Src/ast/nodes/variable'
import { ApplyFunction, makeExprFromInterpretedOperand } from 'Src/ast/nodes/apply-function'
import { ApplyApplicative } from 'Src/ast/nodes/apply-applicative'
import { Return, ConvertToRValue } from 'Src/ast/nodes/misc'
import { Cast, makeCast } from 'Src/ast/nodes/cast'
import { makeExprFromDefFunctionExpr } from 'Src/ast/nodes/define-function-expr'

import * as u from 'Src/utils'

type ExprType =
	| ImmediateValue
	| ApplyFunction
	| VariableRef
	| If
	| While
	| LetStmt
	| Return
	| ConvertToRValue
	| Break
	| ArrayLiteral
	| ApplyApplicative
	| NewStruct
	| MemberAccess
	| Cast
	| Ctv
export class Expr extends prim.TypedValueNode<ExprType> {}

function makeExprFromTerm(s: BlockState, term: p.Term): Expr {
	const v = term.value

	if (v instanceof p.NumberNode || v instanceof p.StringNode) {
		return new Expr(makeImmdiateValue(v))
	} else if (v instanceof p.Bracket) {
		return makeExprFormExpr(s, v.value)
	} else if (v instanceof p.Identifier) {
		return makeExprFromIdentifier(s, v)
	} else if (v instanceof p.If) {
		return new Expr(makeIf(s, v))
	} else if (v instanceof p.While) {
		return new Expr(makeWhile(s, v))
	} else if (v instanceof p.Break) {
		return new Expr(makeBreak(s))
	} else if (v instanceof p.ArrayLiteral) {
		return new Expr(makeArrayLiteral(s, v))
	} else if (v instanceof p.NewStruct) {
		return new Expr(makeNewStruct(s, v))
	} else if (v instanceof p.Cast) {
		return new Expr(makeCast(s, v))
	} else if (v instanceof p.DefFunctionExpr) {
		return makeExprFromDefFunctionExpr(s, v)
	} else {
		u.unreachable(v)
	}
}

export function makeExprFromOperand(s: BlockState, operand: p.Operand): Expr {
	const v = operand.value
	if (v instanceof p.Term) {
		return makeExprFromTerm(s, v)
	} else {
		u.unreachable(v)
	}
}

export function makeExprFormExpr(s: BlockState, expr: p.Expr): Expr {
	const interpreted = p.interpretOps(expr)
	return makeExprFromInterpretedOperand(s, interpreted)
}

export function makeExprFormStmt(s: BlockState, stmt: p.Stmt): Expr {
	const v = stmt.value
	if (v instanceof p.Expr) {
		return makeExprFormExpr(s, v)
	} else if (v instanceof p.LetStmt) {
		return makeExprFromLetStmt(s, v)
	} else {
		u.unreachable(v)
	}
}
