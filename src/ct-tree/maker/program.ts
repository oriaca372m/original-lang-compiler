import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { makeCtFuncDef } from './ct-func-def'

export function makeProgram(pNode: p.Program): nodes.Program {
	const funcs = []
	for (const defFunc of pNode.defFunctions.value) {
		const funcDef = makeCtFuncDef(defFunc)
		if (funcDef !== undefined) {
			funcs.push(funcDef)
		}
	}

	return new nodes.Program(funcs)
}
