import * as u from 'Src/utils'
import * as p from 'Src/parser'

import * as nodes from 'Src/ast/nodes'
import { BlockState } from '../define-function'
import { makeExprFromLetStmt } from '../variable'

import { interpretedOperandToExpr } from './interpreted-operand'

export function makeExpr(s: BlockState, expr: p.Expr): nodes.Expr {
	const interpreted = p.interpretOps(expr)
	return interpretedOperandToExpr(s, interpreted)
}

function stmtToExpr(s: BlockState, stmt: p.Stmt): nodes.Expr {
	const v = stmt.value
	if (v instanceof p.Expr) {
		return makeExpr(s, v)
	} else if (v instanceof p.LetStmt) {
		return makeExprFromLetStmt(s, v)
	} else {
		u.unreachable(v)
	}
}

export function makeMultipleExpr(s: BlockState, stmts: p.MultipleStmt): nodes.MultipleExpr {
	const bs = new BlockState(s.dfs, s.nameResolver.createChild())
	const exprs = stmts.value.map((x) => stmtToExpr(bs, x))
	return new nodes.MultipleExpr(exprs)
}
