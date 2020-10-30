import { State } from 'Src/assembler/state'

export class Label {
	constructor(private readonly _name: string) {}

	get name(): string {
		return this._name
	}
}

export interface AsmValue {
	asmStr(): string
}

export class Register implements AsmValue {
	constructor(private readonly _name: string) {}

	get name(): string {
		return this._name
	}

	asmStr(): string {
		return `%${this._name}`
	}
}

export const registers = {
	// Accumulator
	rax: new Register('rax'),
	// Base
	// callee saved
	rbx: new Register('rbx'),
	// Counter
	rcx: new Register('rcx'),
	// Data
	rdx: new Register('rdx'),
	// Source Index
	rsi: new Register('rsi'),
	// Destination Index
	rdi: new Register('rdi'),
	// Stack Base Pointer
	// callee saved
	rbp: new Register('rbp'),
	// Stack Pointer
	rsp: new Register('rsp'),

	// 汎用レジスタ
	r8: new Register('r8'),
	r9: new Register('r9'),
	r10: new Register('r10'),
	r11: new Register('r11'),
	// callee saved
	r12: new Register('r12'),
	// callee saved
	r13: new Register('r13'),
	// callee saved
	r14: new Register('r14'),
	// callee saved
	r15: new Register('r15'),
} as const

export const r = registers

export class Constant {
	constructor(private readonly _value: number | Label) {}

	get value(): number | Label {
		return this._value
	}

	toString(): string {
		if (typeof this._value === 'number') {
			return this._value.toString()
		} else {
			return this._value.name
		}
	}
}

export class ImmediateValue implements AsmValue {
	constructor(private readonly _value: Constant) {}

	get value(): Constant {
		return this._value
	}

	asmStr(): string {
		return `$${this.value.toString()}`
	}
}

export function con(value: number | Label): Constant {
	return new Constant(value)
}

export function imm(value: number | Label): ImmediateValue {
	return new ImmediateValue(con(value))
}

export class AbsoluteAddress implements AsmValue {
	constructor(private readonly _value: Constant) {}

	get value(): Constant {
		return this._value
	}

	asmStr(): string {
		return this.value.toString()
	}
}

export function addr(value: number | Label): AbsoluteAddress {
	return new AbsoluteAddress(con(value))
}

type Scale = 1 | 2 | 4 | 8
export class RelativeAddress implements AsmValue {
	private readonly _base: Register
	private readonly _disp?: AbsoluteAddress
	private readonly _index?: Register
	private readonly _scale?: Scale

	constructor(base: Register)
	constructor(base: Register, disp: AbsoluteAddress)
	constructor(base: Register, disp: AbsoluteAddress, index: Register)
	constructor(base: Register, disp: AbsoluteAddress, index: Register, scale: Scale)
	constructor(base: Register, index: Register)
	constructor(base: Register, index: Register, scale: Scale)
	constructor(
		base: Register,
		dispOrIndex?: AbsoluteAddress | Register,
		indexOrScale?: Register | Scale,
		scale?: Scale
	)
	constructor(
		base: Register,
		dispOrIndex?: AbsoluteAddress | Register,
		indexOrScale?: Register | Scale,
		scale?: Scale
	) {
		this._base = base

		if (dispOrIndex instanceof AbsoluteAddress) {
			this._disp = dispOrIndex
		} else if (dispOrIndex instanceof Register) {
			this._index = dispOrIndex
		}

		if (indexOrScale instanceof Register) {
			this._index = indexOrScale
		} else if (indexOrScale !== undefined) {
			this._scale = indexOrScale
		}

		if (scale !== undefined) {
			this._scale = scale
		}
	}

	asmStr(): string {
		const tmp = [this._base?.asmStr(), this._index?.asmStr(), this._scale?.toString()]
		const inPair = tmp.filter((v) => v !== undefined).join(', ')
		return `${this._disp?.asmStr() ?? ''}(${inPair})`
	}
}

export type Address = AbsoluteAddress | RelativeAddress

export function rel(base: Register): RelativeAddress
export function rel(base: Register, disp: AbsoluteAddress): RelativeAddress
export function rel(base: Register, disp: AbsoluteAddress, index: Register): RelativeAddress
export function rel(
	base: Register,
	disp: AbsoluteAddress,
	index: Register,
	scale: Scale
): RelativeAddress
export function rel(base: Register, index: Register): RelativeAddress
export function rel(base: Register, index: Register, scale: Scale): RelativeAddress
export function rel(
	base: Register,
	dispOrIndex?: AbsoluteAddress | Register,
	indexOrScale?: Register | Scale,
	scale?: Scale
): RelativeAddress {
	return new RelativeAddress(base, dispOrIndex, indexOrScale, scale)
}

export interface AsmInstruction {
	asmStr(): string
}

export class AsmNormalInstruction implements AsmInstruction {
	constructor(private _opcode: string, private _operands: AsmValue[]) {}

	asmStr(): string {
		const operandsString = this._operands.map((x) => x.asmStr()).join(', ')
		if (operandsString === '') {
			return `\t${this._opcode}\n`
		} else {
			return `\t${this._opcode} ${operandsString}\n`
		}
	}
}

export class AsmRawInstruction implements AsmInstruction {
	constructor(private _opcode: string) {}

	asmStr(): string {
		return this._opcode
	}
}

export class Asm {
	private _state: State = new State()
	private _instructions: AsmInstruction[] = []

	get s(): State {
		return this._state
	}

	private _addInstruction(instruction: AsmInstruction): void {
		this._instructions.push(instruction)
	}

	private _addNormalInstruction(opcode: string, ...operands: AsmValue[]): void {
		this._addInstruction(new AsmNormalInstruction(opcode, operands))
	}

	private _addRawInstruction(raw: string): void {
		this._addInstruction(new AsmRawInstruction(raw))
	}

	// 普通の命令軍団

	mov(src: AsmValue, dst: AsmValue): void {
		this._addNormalInstruction('movq', src, dst)
	}

	lea(src: AsmValue, dst: AsmValue): void {
		this._addNormalInstruction('leaq', src, dst)
	}

	push(src: AsmValue): void {
		this._addNormalInstruction('pushq', src)
	}

	pop(dst: AsmValue): void {
		this._addNormalInstruction('popq', dst)
	}

	add(delta: AsmValue, target: AsmValue): void {
		this._addNormalInstruction('addq', delta, target)
	}

	sub(delta: AsmValue, target: AsmValue): void {
		this._addNormalInstruction('subq', delta, target)
	}

	mul(multiplier: AsmValue): void {
		this._addNormalInstruction('mulq', multiplier)
	}

	call(name: Address): void {
		this._addNormalInstruction('call', name)
	}

	callIndirect(reg: Register): void {
		this._addNormalInstruction('call *', reg)
	}

	ret(): void {
		this._addNormalInstruction('ret')
	}

	cmp(op1: AsmValue, op2: AsmValue): void {
		this._addNormalInstruction('cmpq', op1, op2)
	}

	je(label: Address): void {
		this._addNormalInstruction('je', label)
	}

	jmp(label: Address): void {
		this._addNormalInstruction('jmp', label)
	}

	// 疑似命令軍団

	defLabel(label: Label): void {
		this._addRawInstruction(`${label.name}:\n`)
	}

	defString(str: string): void {
		this._addRawInstruction(`\t.ascii "${str}\\0"\n`)
	}

	enterDataSection(): void {
		this._addRawInstruction('.data\n')
	}

	exportLabel(label: Label): void {
		this._addRawInstruction(`.global ${label.name}\n`)
	}

	// comment
	c(str: string): void {
		this._addRawInstruction(`\t# ${str}\n`)
	}

	// new line
	nl(): void {
		this._addRawInstruction('\n')
	}

	toString(): string {
		return this._instructions.map((x) => x.asmStr()).join('')
	}
}
