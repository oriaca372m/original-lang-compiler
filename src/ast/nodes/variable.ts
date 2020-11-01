import * as p from 'Src/parser'

import { ValueType, voidType, intType, stringType, rValue, lValue } from 'Src/ast/langtype'
import { Variable } from 'Src/ast/variable'
import { Name } from 'Src/ast/name'
import { builtInFunctions } from 'Src/ast/builtin'
import { BuiltInFunction } from 'Src/ast/langfunction'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { Expr, makeExprFormExpr } from 'Src/ast/nodes/expr'
import { toRValue } from 'Src/ast/nodes/misc'
import { Ctv, Overload } from 'Src/ast/compile-time'

export class VariableRef extends prim.ValueNode<Variable> implements prim.TypedNode {
	get type(): ValueType {
		return new ValueType(this.value.type, lValue)
	}
}

export function makeExprFromVariable(s: BlockState, v: p.Variable): Expr {
	const name = v.value
	const nameValue = s.nameResolver.resolve(v.value)?.value

	if (nameValue === undefined) {
		const func = builtInFunctions[name]
		if (func !== undefined) {
			return new Expr(new Ctv(new Overload([func])))
		}

		if (name === 'overload_test') {
			const overload = new Overload([
				new BuiltInFunction('print', [intType], voidType),
				new BuiltInFunction('print_string_length', [stringType, intType], voidType),
			])

			return new Expr(new Ctv(overload))
		}

		throw `名前が見つからない: ${name}`
	}

	if (nameValue.kind === 'variable') {
		return new Expr(new VariableRef(nameValue.value))
	} else if (nameValue.kind === 'overload') {
		return new Expr(new Ctv(nameValue.value))
	}

	throw `変数じゃないなにかを参照してる: ${name}`
}

export class LetStmt implements prim.TypedNode {
	constructor(private readonly _variable: Variable, private readonly _expr: Expr) {
		if (!_expr.type.vc.isRValue) {
			throw '式の値カテゴリがだめ'
		}

		if (!_variable.type.equals(_expr.type.core)) {
			throw '型が違う'
		}
	}

	get variable(): Variable {
		return this._variable
	}

	get expr(): Expr {
		return this._expr
	}

	get type(): ValueType {
		return new ValueType(voidType, rValue)
	}
}

export function makeLetStmt(s: BlockState, stmt: p.LetStmt): LetStmt {
	const expr = makeExprFormExpr(s, stmt.expr)
	const variable = new Variable(stmt.name.value, expr.type.core)
	s.nameResolver.set(new Name(stmt.name.value, { kind: 'variable', value: variable }))
	return new LetStmt(variable, toRValue(expr))
}
