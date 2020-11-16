import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { makeCtFuncDef } from './ct-func-def'
import { makeRtFuncDef } from './rt-func-def'

export function makeProgram(pNode: p.Program): nodes.Program {
	const ctFuncs = []
	const rtFuncs = []

	for (const defFunc of pNode.defFunctions.value) {
		const funcDef = makeCtFuncDef(defFunc)
		if (funcDef !== undefined) {
			ctFuncs.push(funcDef)
			continue
		}

		rtFuncs.push(makeRtFuncDef(defFunc))
	}

	return new nodes.Program(ctFuncs, rtFuncs)
}
