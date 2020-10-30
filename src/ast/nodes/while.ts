import * as p from 'Src/parser'

import { ValueType, intType, voidType, rValue } from 'Src/ast/langtype'

import * as prim from 'Src/ast/nodes/primitive'
import { BlockState } from 'Src/ast/nodes/define-function'
import { MultipleExpr, makeMultipleExpr } from 'Src/ast/nodes/misc'
import { Expr, makeExprFormExpr } from 'Src/ast/nodes/expr'

export class While implements prim.TypedNode {
	private _cond!: Expr
	private _body!: MultipleExpr

	init(_cond: Expr, _body: MultipleExpr): void {
		if (!_cond.type.isRValueType(intType)) {
			throw 'whileの条件式はrvalue intでよろしく'
		}

		this._cond = _cond
		this._body = _body
	}

	get cond(): Expr {
		return this._cond
	}

	get body(): MultipleExpr {
		return this._body
	}

	get type(): ValueType {
		return new ValueType(voidType, rValue)
	}
}

export function makeWhile(s: BlockState, whileNode: p.While): While {
	const node = new While()
	const oldWhile = s.dfs.currentWhile
	s.dfs.currentWhile = node
	node.init(makeExprFormExpr(s, whileNode.cond), makeMultipleExpr(s, whileNode.body))
	s.dfs.currentWhile = oldWhile
	return node
}

export class Break implements prim.TypedNode {
	constructor(private readonly _target: While) {}

	get target(): While {
		return this._target
	}

	get type(): ValueType {
		return new ValueType(voidType, rValue)
	}
}

export function makeBreak(s: BlockState): Break {
	if (s.dfs.currentWhile === undefined) {
		throw 'breakはwhileの中で使うべし'
	}

	return new Break(s.dfs.currentWhile)
}
