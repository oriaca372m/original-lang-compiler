import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { makeCtExprFromTypeNode } from './misc'
import { makeRtMultipleExpr } from './rt-expr'
import { FuncDefState, BlockState } from './states'

interface RtFuncDecl {
	params: nodes.RtFuncParam[]
	resultType: nodes.CtExpr
}

function readDefFuncDecl(bs: BlockState, pNode: p.DefFunction): RtFuncDecl {
	const params = []
	for (const param of pNode.params.value) {
		params.push(new nodes.RtFuncParam(param.name.value, makeCtExprFromTypeNode(bs, param.type)))
	}

	const resultType = makeCtExprFromTypeNode(bs, pNode.resultType)
	return { params, resultType }
}

export function makeRtFuncDef(fds: FuncDefState, pNode: p.DefFunction): nodes.RtFuncDef {
	const decl = readDefFuncDecl(fds.createBlockState(), pNode)

	return new nodes.RtFuncDef(
		pNode.name.value,
		decl.params,
		decl.resultType,
		makeRtMultipleExpr(fds.createBlockState(), pNode.body)
	)
}
