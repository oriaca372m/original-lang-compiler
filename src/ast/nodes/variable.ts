import { ValueType, voidType, rValue, lValue } from 'Src/ast/langtype'
import { Variable } from 'Src/ast/variable'

import { TypedNode, ValueNode } from './primitive'
import { Expr } from './expr'

export class VariableRef extends ValueNode<Variable> implements TypedNode {
	get type(): ValueType {
		return new ValueType(this.value.type, lValue)
	}
}

export class LetStmt implements TypedNode {
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
