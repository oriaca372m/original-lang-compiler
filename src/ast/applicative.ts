import { Expr } from 'Src/ast/nodes/expr'
import { ValueType } from 'Src/ast/langtype'

export abstract class Applicative {
	abstract name: string
	abstract resultType(args: ValueType[]): ValueType | undefined

	transformArgs(args: Expr[]): Expr[] {
		return args
	}
}

export abstract class BinaryOpApplicative extends Applicative {
	abstract name: string
	abstract resultTypeImpl(rhs: ValueType, lhs: ValueType): ValueType | undefined
	transformArgsImpl(rhs: Expr, lhs: Expr): [Expr, Expr] {
		return [rhs, lhs]
	}

	resultType(args: ValueType[]): ValueType | undefined {
		if (args.length !== 2) {
			throw '二項演算子は2項で呼び出してね'
		}

		return this.resultTypeImpl(args[0], args[1])
	}

	transformArgs(args: Expr[]): Expr[] {
		return this.transformArgsImpl(args[0], args[1])
	}
}

export abstract class UnaryOpApplicative extends Applicative {
	abstract name: string
	abstract resultTypeImpl(operand: ValueType): ValueType | undefined
	transformArgsImpl(operand: Expr): Expr {
		return operand
	}

	resultType(args: ValueType[]): ValueType | undefined {
		if (args.length !== 1) {
			throw '単項演算子は1項で呼び出してね'
		}

		return this.resultTypeImpl(args[0])
	}

	transformArgs(args: Expr[]): Expr[] {
		return [this.transformArgsImpl(args[0])]
	}
}
