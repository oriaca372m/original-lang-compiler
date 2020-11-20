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
	const rtFuncs = []

	for (const defFunc of pNode.defFunctions.value) {
		const funcDef = makeCtFuncDef(ps.createFuncDefState(), defFunc)
		if (funcDef !== undefined) {
			ps.nameResolver.set(
				new Name(
					funcDef.name,
					new NameValueCtImm(
						new nodes.CtImmediateValue(
							new CtFunc(
								funcDef.name,
								funcDef.params.map((x) => x.ctType),
								funcDef.resultType
							)
						)
					)
				)
			)
			ctFuncs.push(funcDef)
			continue
		}

		rtFuncs.push(makeRtFuncDef(ps.createFuncDefState(), defFunc))
	}

	return new nodes.Program(ctFuncs, rtFuncs)
}
