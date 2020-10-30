import * as u from 'Src/utils'
import { LinkedListItem } from 'Src/linkedlist'
import { Operand, Operator, Suffix, ExprType, Expr } from 'Src/parser/nodes/expr'

type InterpretedOperandType = BinaryOperation | UnaryOperation | ApplySuffix | Operand
export class InterpretedOperand {
	constructor(private readonly _value: InterpretedOperandType) {}

	get value(): InterpretedOperandType {
		return this._value
	}
}

export class BinaryOperation {
	constructor(
		private readonly _op: Operator,
		private readonly _lhs: InterpretedOperand,
		private readonly _rhs: InterpretedOperand
	) {}

	get op(): Operator {
		return this._op
	}

	get lhs(): InterpretedOperand {
		return this._lhs
	}

	get rhs(): InterpretedOperand {
		return this._rhs
	}
}

export class UnaryOperation {
	constructor(private readonly _op: Operator, private readonly _operand: InterpretedOperand) {}

	get op(): Operator {
		return this._op
	}

	get operand(): InterpretedOperand {
		return this._operand
	}
}

export class ApplySuffix {
	constructor(private readonly _suffix: Suffix, private readonly _operand: InterpretedOperand) {}

	get suffix(): Suffix {
		return this._suffix
	}

	get operand(): InterpretedOperand {
		return this._operand
	}
}

type InterpretingOperand = ExprType | InterpretedOperand

function interpretApplySuffix(
	tokens: LinkedListItem<InterpretingOperand>,
	names: string[]
): number {
	let count = 0
	let node = tokens.right

	while (node !== undefined && node.value !== undefined) {
		const v = node.value

		if (v instanceof Operand || v instanceof InterpretedOperand) {
			const rightValue = node.right?.value
			if (rightValue instanceof Suffix) {
				u.assert(
					names.some((x) => x === rightValue.name),
					`対応していないsuffix: ${rightValue.name}`
				)
				const iterm = new InterpretedOperand(
					new ApplySuffix(
						rightValue,
						v instanceof Operand ? new InterpretedOperand(v) : v
					)
				)

				const left = node.left ?? u.unreachable()
				const rightRight = node.right?.right
				node = left.conj(iterm)
				node.setRight(rightRight)
				count++
				continue
			}
		}

		node = node.right
	}

	return count
}

function interpretUnaryOperation(
	tokens: LinkedListItem<InterpretingOperand>,
	opNames: string[]
): number {
	let count = 0
	let node = tokens.right

	while (node !== undefined && node.value !== undefined) {
		const v = node.value

		if (v instanceof Operand || v instanceof InterpretedOperand) {
			const leftValue = node.left?.value
			if (leftValue instanceof Operator) {
				const leftLeft = node.left?.left ?? u.unreachable()
				const leftLeftValue = leftLeft.value

				if (leftLeftValue === undefined || leftLeftValue instanceof Operator) {
					u.assert(
						opNames.some((x) => x === leftValue.value),
						`対応していない単項演算子: ${leftValue.value}`
					)
					const iterm = new InterpretedOperand(
						new UnaryOperation(
							leftValue,
							v instanceof Operand ? new InterpretedOperand(v) : v
						)
					)

					const right = node.right
					node = leftLeft.conj(iterm)
					node.setRight(right)
					count++
					continue
				}
			}
		}

		node = node.right
	}

	return count
}

function interpretBinaryOperation(
	tokens: LinkedListItem<InterpretingOperand>,
	opNames: string[]
): number {
	let count = 0
	let node = tokens.right

	while (node !== undefined && node.value !== undefined) {
		const v = node.value

		if (v instanceof Operator && opNames.some((x) => x === v.value)) {
			const lhs = node.left?.value
			if (!(lhs instanceof Operand || lhs instanceof InterpretedOperand)) {
				throw 'だめ'
			}
			const rhs = node.right?.value
			if (!(rhs instanceof Operand || rhs instanceof InterpretedOperand)) {
				throw 'だめ'
			}

			const iterm = new InterpretedOperand(
				new BinaryOperation(
					v,
					lhs instanceof Operand ? new InterpretedOperand(lhs) : lhs,
					rhs instanceof Operand ? new InterpretedOperand(rhs) : rhs
				)
			)
			const next_right = node.right?.right
			node = node.left?.left ?? u.unreachable()
			node.conj(iterm).setRight(next_right)
			node = node.right?.right

			count++
			continue
		}

		node = node.right
	}

	return count
}

export interface OperatorPriorityEntry {
	type: 'suffix' | 'unary' | 'binary'
	names: string[]
}

const priority: OperatorPriorityEntry[] = [
	{ type: 'suffix', names: ['FunctionCallArgument', 'IndexAccess', 'MemberAccess'] },
	{ type: 'unary', names: ['*', '&'] },
	{ type: 'binary', names: ['@'] },
	{ type: 'binary', names: ['**'] },
	{ type: 'binary', names: ['*', '/'] },
	{ type: 'binary', names: ['+', '-'] },
	{ type: 'binary', names: ['&+'] },
	{ type: 'binary', names: ['<'] },
	{ type: 'binary', names: ['=='] },
	{ type: 'binary', names: ['='] },
]

export function interpretOps(inputTokens: Expr): InterpretedOperand {
	const tokens = LinkedListItem.fromArray<InterpretingOperand>(inputTokens.value)

	for (let shouldContinue = true; shouldContinue; ) {
		shouldContinue = false

		for (const entry of priority) {
			let interpretedCount = 0
			if (entry.type === 'suffix') {
				interpretedCount = interpretApplySuffix(tokens, entry.names)
			} else if (entry.type === 'unary') {
				interpretedCount = interpretUnaryOperation(tokens, entry.names)
			} else if (entry.type === 'binary') {
				interpretedCount = interpretBinaryOperation(tokens, entry.names)
			}

			if (0 < interpretedCount) {
				shouldContinue = true
				break
			}
		}
	}

	const tokensArr = tokens.toArray()
	if (tokensArr.length === 1) {
		const res = tokensArr[0]
		if (res instanceof InterpretedOperand) {
			return res
		} else if (res instanceof Operand) {
			return new InterpretedOperand(res)
		}
	}

	console.error(u.inspect(tokensArr))
	throw `なんかだめ`
}
