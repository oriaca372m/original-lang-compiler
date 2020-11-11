export { Variable } from 'Src/ast/variable'
export {
	ValueType,
	TypeCore,
	intType,
	stringType,
	voidType,
	PointerType,
	FixedArrayType,
	FunctionType,
} from 'Src/ast/langtype'
export { LangFunction } from 'Src/ast/langfunction'
export { Ctv } from 'Src/ast/compile-time'

export * from 'Src/ast/nodes'
export { makeProgram } from 'Src/ast/maker'
