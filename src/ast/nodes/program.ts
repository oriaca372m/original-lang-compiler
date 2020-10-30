import * as p from 'Src/parser'

import { Name, NameResolver } from 'Src/ast/name'
import { LangStructManager } from 'Src/ast/langstruct'
import { StructType } from 'Src/ast/langtype'

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
		s.nameResolver.set(new Name(name, { kind: 'type', value: type }))

		const langStruct = makeLangStruct(s.nameResolver, defineStruct)
		s.langStructManager.set(type.name, langStruct)
	}

	for (const defFunction of program.defFunctions.value) {
		const langFunction = readFunctionDecl(s.nameResolver, defFunction)
		s.nameResolver.set(new Name(langFunction.name, { kind: 'function', value: langFunction }))
	}

	for (const defFunction of program.defFunctions.value) {
		defineFunctions.push(makeDefineFunction(s, defFunction))
	}

	return new Program(defineFunctions)
}
