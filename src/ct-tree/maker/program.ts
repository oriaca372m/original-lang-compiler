import * as p from 'Src/parser'

import * as nodes from 'Src/ct-tree/nodes'
import { CtFunc } from 'Src/ct-tree/ct-func'
import { makeCtFuncDef } from './ct-func-def'
import { makeRtFuncDef } from './rt-func-def'
import { ProgramState } from './states'
import { Name, NameValueCtImm } from './name-resolver'

export function makeProgram(pNode: p.Program): nodes.Program {
	const ps = new ProgramState()
	const ctFuncs = []
	const ctFuncDefs = []
	const rtFuncDefs = []

	for (const defFunc of pNode.defFunctions.value) {
		const funcDef = makeCtFuncDef(ps.createFuncDefState(), defFunc)
		if (funcDef !== undefined) {
			const ctFunc = new CtFunc(
				funcDef.name,
				funcDef.params.map((x) => x.ctType),
				funcDef.resultType
			)
			ctFunc.setFuncDef(funcDef)
			ctFuncs.push(ctFunc)

			ps.nameResolver.set(
				new Name(funcDef.name, new NameValueCtImm(new nodes.CtImmediateValue(ctFunc)))
			)
			ctFuncDefs.push(funcDef)
			continue
		}

		rtFuncDefs.push(makeRtFuncDef(ps.createFuncDefState(), defFunc))
	}

	return new nodes.Program(ctFuncDefs, rtFuncDefs, ctFuncs)
}
