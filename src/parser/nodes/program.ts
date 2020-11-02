import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { DefFunction, parseDefFunction } from 'Src/parser/nodes/define-function'
import { DefineStruct, parseDefineStruct } from 'Src/parser/nodes/struct'

export class Program {
	constructor(
		private readonly _defFunctions: prim.ListNode<DefFunction>,
		private readonly _defineStructs: DefineStruct[]
	) {}

	get defFunctions(): prim.ListNode<DefFunction> {
		return this._defFunctions
	}

	get defineStructs(): DefineStruct[] {
		return this._defineStructs
	}
}

export function parseProgram(s: Source): Program {
	const defFunctions: DefFunction[] = []
	const defineStructs: DefineStruct[] = []

	s.skipRegExp(/[\n\t ]/)

	for (;;) {
		;(() => {
			const dfunc = prim.tryParse(s, parseDefFunction)
			if (prim.isNotError(dfunc)) {
				defFunctions.push(dfunc)
				return
			}

			const dstruct = prim.tryParse(s, parseDefineStruct)
			if (prim.isNotError(dstruct)) {
				defineStructs.push(dstruct)
				return
			}
		})()

		s.skipRegExp(/[\n\t ]/)

		if (s.isEof) {
			break
		}
	}

	return new Program(new prim.ListNode(defFunctions), defineStructs)
}
