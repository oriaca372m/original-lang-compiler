import * as p from 'Src/parser'
import * as u from 'Src/utils'

import * as nodes from 'Src/ct-tree/nodes'
import { interpretedOperandToRtExpr } from './interpreted-operand'
import { BlockState } from '../states'

export function makeRtExpr(bs: BlockState, pNode: p.Expr): nodes.RtExpr | nodes.CtExpr {
	const interpreted = p.interpretOps(pNode)
	return interpretedOperandToRtExpr(bs, interpreted)
}

function stmtToRtExpr(bs: BlockState, stmt: p.Stmt): nodes.RtExpr | nodes.CtExpr {
	const v = stmt.value
	if (v instanceof p.Expr) {
		return makeRtExpr(bs, v)
	} else if (v instanceof p.LetStmt) {
		u.notImplemented()
	} else {
		u.unreachable(v)
	}
}

export function makeRtMultipleExpr(
	parentBs: BlockState,
	pNode: p.MultipleStmt
): nodes.RtMultipleExpr {
	const bs = parentBs.createChild()
	const exprs = pNode.value.map((x) => {
		const expr = stmtToRtExpr(bs, x)
		if (expr instanceof nodes.CtExpr) {
			return new nodes.RtDoCtExpr(expr)
		}
		return expr
	})
	return new nodes.RtMultipleExpr(exprs)
}
