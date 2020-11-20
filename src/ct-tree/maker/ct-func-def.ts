import * as p from 'Src/parser'

import { CtType } from 'Src/ct-tree/ct-type'

import * as nodes from 'Src/ct-tree/nodes'
import { resolveCtType } from './resolve-ct-type'
import { makeRtMultipleExpr } from './rt-expr'
import { FuncDefState } from './states'

interface CtFuncDecl {
	params: nodes.CtFuncParam[]
	resultCtType: CtType
}

function readDefFuncDecl(pNode: p.DefFunction): CtFuncDecl {
	// TODO: 関数名にRTが含まれていたらCtFuncでは無いということにしておく
	if (pNode.name.value.includes('RT')) {
		throw 'CtFuncじゃなかった'
	}

	const params = []
	for (const param of pNode.params.value) {
		const ctType = resolveCtType(param.type)
		params.push(new nodes.CtFuncParam(param.name.value, ctType))
	}

	const resultCtType = resolveCtType(pNode.resultType)
	return { params, resultCtType }
}

export function makeCtFuncDef(
	fds: FuncDefState,
	pNode: p.DefFunction
): nodes.CtFuncDef | undefined {
	let decl
	try {
		decl = readDefFuncDecl(pNode)
	} catch (e) {
		return undefined
	}

	const exprs = makeRtMultipleExpr(fds.createBlockState(), pNode.body).toCtMultipleExpr()
	if (exprs === undefined) {
		throw '実行時の式が混ざっている'
	}

	return new nodes.CtFuncDef(pNode.name.value, decl.params, decl.resultCtType, exprs)
}
