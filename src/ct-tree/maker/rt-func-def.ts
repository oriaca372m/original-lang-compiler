import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { makeCtExprFromTypeNode } from './ct-expr'

interface RtFuncDecl {
	params: nodes.RtFuncParam[]
	resultType: nodes.CtExpr
}

function readDefFuncDecl(pNode: p.DefFunction): RtFuncDecl {
	const params = []
	for (const param of pNode.params.value) {
		params.push(new nodes.RtFuncParam(param.name.value, makeCtExprFromTypeNode(param.type)))
	}

	const resultType = makeCtExprFromTypeNode(pNode.resultType)
	return { params, resultType }
}

export function makeRtFuncDef(pNode: p.DefFunction): nodes.RtFuncDef {
	const decl = readDefFuncDecl(pNode)

	return new nodes.RtFuncDef(
		pNode.name.value,
		decl.params,
		decl.resultType,
		makeRtMultipleExpr(pNode.body)
	)
}
