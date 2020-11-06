import { LangStruct, LangStructManager } from 'Src/ast/langstruct'

export class ValueCategory {
	constructor(private readonly _isRValue: boolean) {}

	get isRValue(): boolean {
		return this._isRValue
	}

	get isLValue(): boolean {
		return !this._isRValue
	}

	equals(vc: ValueCategory): boolean {
		return this._isRValue === vc._isRValue
	}
}

export const rValue = new ValueCategory(true)
export const lValue = new ValueCategory(false)

export class ValueType<Core extends TypeCore = TypeCore> {
	constructor(private readonly _core: Core, private readonly _vc: ValueCategory) {}

	get core(): Core {
		return this._core
	}

	get vc(): ValueCategory {
		if (this._vc === undefined) {
			throw '不正なvcの参照'
		}
		return this._vc
	}

	equals(other: ValueType): boolean {
		return this._core.equals(other.core) && this.vc.equals(other.vc)
	}

	withCore<NewCore extends TypeCore>(core: NewCore): ValueType<NewCore> {
		return new ValueType(core, this._vc)
	}

	withVc(vc: ValueCategory): ValueType<Core> {
		return new ValueType(this._core, vc)
	}

	isRValueType(core: TypeCore): boolean {
		return this.vc.isRValue && this.core.equals(core)
	}

	isLValueType(core: TypeCore): boolean {
		return this.vc.isLValue && this.core.equals(core)
	}

	getRValue(): ValueType<Core> {
		return new ValueType(this._core, rValue)
	}

	getLValue(): ValueType<Core> {
		return new ValueType(this._core, lValue)
	}
}

export abstract class TypeCore {
	abstract name: string
	abstract size: number

	get hasSize(): boolean {
		return true
	}

	equals(other: TypeCore): boolean {
		return this.name === other.name
	}
}

export class PrimitiveType extends TypeCore {
	constructor(private readonly _name: string, private readonly _size: number) {
		super()
	}

	get name(): string {
		return this._name
	}

	get size(): number {
		return this._size
	}
}

export class FixedArrayType extends TypeCore {
	constructor(private readonly _elmType: TypeCore, private readonly _length: number) {
		super()
	}

	get name(): string {
		return `__FixedArrayType<${this._elmType.name}, ${this._length}>`
	}

	get elmType(): TypeCore {
		return this._elmType
	}

	get size(): number {
		return this._elmType.size * this._length
	}
}

export class PointerType extends TypeCore {
	constructor(private readonly _elmType: TypeCore) {
		super()
	}

	get name(): string {
		return `__PointerType<${this._elmType.name}>`
	}

	get elmType(): TypeCore {
		return this._elmType
	}

	get size(): number {
		return 8
	}
}

export class FunctionType extends TypeCore {
	constructor(private readonly _argTypes: TypeCore[], private readonly _resultType: TypeCore) {
		super()
	}

	get name(): string {
		const typeNames = [this._resultType.name, ...this._argTypes.map((x) => x.name)]
		return `__FunctionType<${typeNames.join(', ')}>`
	}

	get argTypes(): TypeCore[] {
		return this._argTypes
	}

	get resultType(): TypeCore {
		return this._resultType
	}

	get size(): number {
		return 8
	}
}

export class StructType extends TypeCore {
	constructor(
		private readonly _name: string,
		private readonly _langStructManager: LangStructManager
	) {
		super()
	}

	get name(): string {
		return `__StructType_${this._name}`
	}

	get langStruct(): LangStruct | undefined {
		return this._langStructManager.get(this.name)
	}

	get size(): number {
		const langStruct = this.langStruct
		if (langStruct === undefined) {
			throw 'unsized struct type!'
		}

		return langStruct.size
	}

	get hasSize(): boolean {
		return this.langStruct !== undefined
	}
}

export const intType = new PrimitiveType('__Int', 8)
export const stringType = new PrimitiveType('__String', 8)
export const voidType = new PrimitiveType('__Void', 8)
