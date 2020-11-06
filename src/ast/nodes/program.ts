import * as p from 'Src/parser'

import { Name, NameResolver } from 'Src/ast/name'
import { LangStructManager } from 'Src/ast/langstruct'
import { StructType } from 'Src/ast/langtype'
import { LangFunction } from 'Src/ast/langfunction'
import { Ctv, CtVariable, Overload } from 'Src/ast/compile-time'

import { DefineFunction, readFunctionDecl, makeDefineFunction } from 'Src/ast/nodes/define-function'
import { makeLangStruct } from 'Src/ast/nodes/struct'

export class ProgramState {
	private readonly _nameResolver = new NameResolver()
	private readonly _langStructManager = new LangStructManager()

	get nameResolver(): NameResolver {
		return this._nameResolver
	}

	get langStructManager(): LangStructManager {
		return this._langStructManager
	}
}

export class Program {
	constructor(private readonly _defineFunctions: DefineFunction[]) {}

	get defineFunctions(): DefineFunction[] {
		return this._defineFunctions
	}
}

export function makeProgram(program: p.Program): Program {
	const s = new ProgramState()
	const defineFunctions = []

	for (const defineStruct of program.defineStructs) {
		const name = defineStruct.name.value
		const type = new StructType(name, s.langStructManager)
		s.nameResolver.set(
			new Name(name, {
				kind: 'ct-variable',
				value: new CtVariable(name, new Ctv(type)),
			})
		)

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
				new Name(findingName, {
					kind: 'ct-variable',
					value: new CtVariable(findingName, new Ctv(new Overload([langFunction]))),
				})
			)
			continue
		}

		if (name.value.kind === 'ct-variable') {
			const ctv = name.value.value.value
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

	return new Program(defineFunctions)
}
