import * as p from 'Src/parser'

import { CtFunc } from 'Src/ct-tree/ct-func'

import * as nodes from 'Src/ct-tree/nodes'
import { makeCtFuncDef } from './ct-func-def'
import { makeRtFuncDef } from './rt-func-def'
import { ProgramState } from './states'
import { Name } from './name-resolver'

export function makeProgram(pNode: p.Program): nodes.Program {
	const ps = new ProgramState()
	const ctFuncs = []
	const rtFuncs = []

	for (const defFunc of pNode.defFunctions.value) {
		ps.nameResolver.set(new Name(defFunc.name.value))
		const funcDef = makeCtFuncDef(ps.createFuncDefState(new CtFunc()), defFunc)
		if (funcDef !== undefined) {
			ctFuncs.push(funcDef)
			continue
		}

		rtFuncs.push(makeRtFuncDef(ps.createFuncDefState(new CtFunc()), defFunc))
	}

	return new nodes.Program(ctFuncs, rtFuncs)
}
