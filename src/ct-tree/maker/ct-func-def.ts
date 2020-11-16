import * as p from 'Src/parser'

import { CtType } from 'Src/ct-tree/ct-type'

import * as nodes from 'Src/ct-tree/nodes'
import { resolveCtType } from './resolve-ct-type'
import { makeCtMultipleExpr } from './ct-expr'

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

export function makeCtFuncDef(pNode: p.DefFunction): nodes.CtFuncDef | undefined {
	let decl
	try {
		decl = readDefFuncDecl(pNode)
	} catch (e) {
		return undefined
	}

	return new nodes.CtFuncDef(
		pNode.name.value,
		decl.params,
		decl.resultCtType,
		makeCtMultipleExpr(pNode.body)
	)
}
