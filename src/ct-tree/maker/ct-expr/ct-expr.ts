import * as p from 'Src/parser'
import * as u from 'Src/utils'

import * as nodes from 'Src/ct-tree/nodes'
import { interpretedOperandToCtExpr } from './interpreted-operand'

export function makeCtExpr(pNode: p.Expr): nodes.CtExpr {
	const interpreted = p.interpretOps(pNode)
	return interpretedOperandToCtExpr(interpreted)
}

function stmtToCtExpr(stmt: p.Stmt): nodes.CtExpr {
	const v = stmt.value
	if (v instanceof p.Expr) {
		return makeCtExpr(v)
	} else if (v instanceof p.LetStmt) {
		u.notImplemented()
	} else {
		u.unreachable(v)
	}
}

export function makeCtMultipleExpr(pNode: p.MultipleStmt): nodes.CtMultipleExpr {
	const exprs = pNode.value.map((x) => stmtToCtExpr(x))
	return new nodes.CtMultipleExpr(exprs)
}
