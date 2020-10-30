import * as ast from 'Src/ast'
import { Label } from 'Src/assembler'

type VariableInfo = {
	offset: number
	rbpOffset: number
}

type WhileInfo = {
	endLabel: Label
}

type VariableTable = Map<ast.Variable, VariableInfo>
type WhileTable = Map<ast.While, WhileInfo>

export class FunctionState {
	private _variableTable = new Map<ast.Variable, VariableInfo>()
	private _whileTable = new Map<ast.While, WhileInfo>()

	// TODO: とりあえず
	public variableTableTotalSize = 0

	constructor(
		private readonly _ps: ProgramState,
		private readonly _langFunction: ast.LangFunction
	) {}

	get ps(): ProgramState {
		return this._ps
	}

	get langFunction(): ast.LangFunction {
		return this._langFunction
	}

	get variableTable(): VariableTable {
		return this._variableTable
	}

	get whileTable(): WhileTable {
		return this._whileTable
	}
}

export interface LangFunctionInfo {
	params: {
		type: ast.TypeCore
		offset: number
	}[]
	totalParamSize: number
	label: Label
}

type LangFunctionTable = Map<ast.LangFunction, LangFunctionInfo>

export class ProgramState {
	private _langFunctionTable = new Map<ast.LangFunction, LangFunctionInfo>()

	get langFunctionTable(): LangFunctionTable {
		return this._langFunctionTable
	}
}
