import * as p from 'Src/parser'

import { Name, NameResolver } from 'Src/ast/name'
import { LangStructManager } from 'Src/ast/langstruct'
import { StructType } from 'Src/ast/langtype'
import { LangFunction } from 'Src/ast/langfunction'
import { Ctv, CtVariable, Overload } from 'Src/ast/compile-time'
import { builtInFunctions, builtInTypes } from 'Src/ast/builtin'

import * as nodes from 'Src/ast/nodes'
import { readFunctionDecl, makeDefineFunction } from './define-function'
import { makeLangStruct } from './struct'

export class ProgramState {
	private readonly _nameResolver: NameResolver
	private readonly _langStructManager = new LangStructManager()
	private readonly _anonymousFunctions: nodes.DefineFunction[] = []

	constructor() {
		const rootNameResolver = new NameResolver()

		for (const [name, type] of Object.entries(builtInTypes)) {
			rootNameResolver.set(new Name(name, new CtVariable(name, new Ctv(type))))
		}

		for (const [name, lf] of Object.entries(builtInFunctions)) {
			rootNameResolver.set(new Name(name, new CtVariable(name, new Ctv(new Overload([lf])))))
		}

		this._nameResolver = rootNameResolver.createChild()
	}

	get nameResolver(): NameResolver {
		return this._nameResolver
	}

	get langStructManager(): LangStructManager {
		return this._langStructManager
	}

	get anonymousFunctions(): nodes.DefineFunction[] {
		return this._anonymousFunctions
	}
}

export function makeProgram(program: p.Program): nodes.Program {
	const s = new ProgramState()
	const defineFunctions = []

	for (const defineStruct of program.defineStructs) {
		const name = defineStruct.name.value
		const type = new StructType(name, s.langStructManager)
		s.nameResolver.set(new Name(name, new CtVariable(name, new Ctv(type))))

		const langStruct = makeLangStruct(s.nameResolver, defineStruct)
		s.langStructManager.set(type.name, langStruct)
	}

	const langFunctionMap = new Map<p.DefFunction, LangFunction>()

	for (const defFunction of program.defFunctions.value) {
		const langFunction = readFunctionDecl(s.nameResolver, defFunction)
		langFunctionMap.set(defFunction, langFunction)
		const findingName = defFunction.name.value
		const name = s.nameResolver.resolveCurrent(findingName)
		if (name === undefined) {
			s.nameResolver.set(
				new Name(
					findingName,
					new CtVariable(findingName, new Ctv(new Overload([langFunction])))
				)
			)
			continue
		}

		if (name.value instanceof CtVariable) {
			const ctv = name.value.value
			if (ctv.value instanceof Overload) {
				ctv.value.addCandidate(langFunction)
				continue
			}
		}

		throw `関数以外で使われている名前: ${findingName}`
	}

	for (const [defFunction, langFunction] of langFunctionMap) {
		defineFunctions.push(makeDefineFunction(s, defFunction, langFunction))
	}

	return new nodes.Program(defineFunctions.concat(s.anonymousFunctions))
}
