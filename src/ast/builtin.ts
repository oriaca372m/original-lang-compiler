import { Applicative, BinaryOpApplicative, UnaryOpApplicative } from 'Src/ast/applicative'
import {
	ValueType,
	FixedArrayType,
	intType,
	stringType,
	voidType,
	PointerType,
	rValue,
	lValue,
} from 'Src/ast/langtype'
import { BuiltInFunction, LangFunction } from 'Src/ast/langfunction'

import { Expr } from 'Src/ast/nodes/expr'
import { toRValue } from 'Src/ast/nodes/misc'

class Substitution extends BinaryOpApplicative {
	readonly name: string = 'substitution'

	resultTypeImpl(dst: ValueType, src: ValueType): ValueType | undefined {
		if (!dst.vc.isLValue) {
			throw '宛先の値カテゴリがだめ'
		}

		if (!dst.core.equals(src.core)) {
			throw '型が違う'
		}

		return dst
	}

	transformArgsImpl(dst: Expr, src: Expr): [Expr, Expr] {
		return [dst, toRValue(src)]
	}
}

class IndexAccess extends BinaryOpApplicative {
	readonly name: string = 'indexAccess'

	resultTypeImpl(arr: ValueType, idx: ValueType): ValueType | undefined {
		if (!idx.core.equals(intType)) {
			throw 'インデックスはintじゃないとダメ'
		}

		if (arr.core instanceof FixedArrayType) {
			return arr.withCore(arr.core.elmType)
		} else {
			throw '型が違う'
		}
	}

	transformArgsImpl(dst: Expr, src: Expr): [Expr, Expr] {
		return [dst, toRValue(src)]
	}
}

class PointerAdd extends BinaryOpApplicative {
	readonly name: string = 'pointerAdd'

	resultTypeImpl(ptr: ValueType, delta: ValueType): ValueType | undefined {
		if (!delta.core.equals(intType)) {
			throw 'インデックスはintじゃないとダメ'
		}

		if (ptr.core instanceof PointerType) {
			return ptr.getRValue()
		} else {
			throw '型が違う'
		}
	}

	transformArgsImpl(ptr: Expr, delta: Expr): [Expr, Expr] {
		return [toRValue(ptr), toRValue(delta)]
	}
}

class GetAddress extends UnaryOpApplicative {
	readonly name: string = 'getAddress'

	resultTypeImpl(operand: ValueType): ValueType | undefined {
		if (!operand.vc.isLValue) {
			throw 'lvalueじゃないとだめ'
		}

		return new ValueType(new PointerType(operand.core), rValue)
	}
}

class Dereference extends UnaryOpApplicative {
	readonly name: string = 'dereference'

	resultTypeImpl(operand: ValueType): ValueType | undefined {
		if (operand.core instanceof PointerType) {
			return new ValueType(operand.core.elmType, lValue)
		} else {
			throw '型が違う'
		}
	}

	transformArgsImpl(operand: Expr): Expr {
		return toRValue(operand)
	}
}

export const builtInBinaryOpApplicatives: { [key: string]: Applicative } = {
	'=': new Substitution(),
	'@': new IndexAccess(),
	'&+': new PointerAdd(),
}

export const builtInUnaryOpApplicatives: { [key: string]: Applicative } = {
	'&': new GetAddress(),
	'*': new Dereference(),
}

export const builtInBinaryOps: { [key: string]: LangFunction } = {
	'+': new BuiltInFunction('+', [intType, intType], intType),
	'*': new BuiltInFunction('*', [intType, intType], intType),
	'==': new BuiltInFunction('==', [intType, intType], intType),
	'<': new BuiltInFunction('<', [intType, intType], intType),
}

export const builtInFunctions: { [key: string]: LangFunction } = {
	print: new BuiltInFunction('print', [intType], voidType),
	print_string_length: new BuiltInFunction(
		'print_string_length',
		[stringType, intType],
		voidType
	),
	strlen: new BuiltInFunction('strlen', [stringType], intType),
}
