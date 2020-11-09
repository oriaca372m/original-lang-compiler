import { Source } from 'Src/parser/source'
import { ParseError } from 'Src/parser/error'
import * as prim from 'Src/parser/nodes/primitive'
import { MultipleStmt, parseMultipleStmt } from 'Src/parser/nodes/stmt'
import { TypeNode, parseTypeNode } from 'Src/parser/nodes/type'
import { FunctionParam, parseFunctionParams } from 'Src/parser/nodes/define-function'

export class DefFunctionExpr {
	constructor(
		private readonly _params: prim.ListNode<FunctionParam>,
		private readonly _body: MultipleStmt,
		private readonly _resultType: TypeNode
	) {}

	get params(): prim.ListNode<FunctionParam> {
		return this._params
	}

	get body(): MultipleStmt {
		return this._body
	}

	get resultType(): TypeNode {
		return this._resultType
	}
}

export function parseDefFunctionExpr(s: Source): DefFunctionExpr | ParseError {
	const err = s.tryWord('def')
	if (prim.isError(err)) {
		return err
	}
	s.skipSpaces()

	const params = prim.force(parseFunctionParams(s))
	s.skipSpaces()

	const resultType = parseTypeNode(s)
	s.skipSpaces()

	const body = prim.force(parseMultipleStmt(s))

	return new DefFunctionExpr(params, body, resultType)
}
