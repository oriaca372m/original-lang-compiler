import * as p from 'Src/parser'
import * as u from 'Src/utils'

import * as nodes from 'Src/ct-tree/nodes'
import { interpretedOperandToRtExpr } from './interpreted-operand'

export function makeRtExpr(pNode: p.Expr): nodes.RtExpr | nodes.CtExpr {
	const interpreted = p.interpretOps(pNode)
	return interpretedOperandToRtExpr(interpreted)
}

function stmtToRtExpr(stmt: p.Stmt): nodes.RtExpr | nodes.CtExpr {
	const v = stmt.value
	if (v instanceof p.Expr) {
		return makeRtExpr(v)
	} else if (v instanceof p.LetStmt) {
		u.notImplemented()
	} else {
		u.unreachable(v)
	}
}

export function makeRtMultipleExpr(pNode: p.MultipleStmt): nodes.RtMultipleExpr | nodes.CtExpr {
	const exprs = pNode.value.map((x) => stmtToRtExpr(x))
	return new nodes.RtMultipleExpr(exprs)
}
