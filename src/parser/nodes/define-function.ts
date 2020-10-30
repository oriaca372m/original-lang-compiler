import { Source } from 'Src/parser/source'
import * as prim from 'Src/parser/nodes/primitive'
import { MultipleStmt, parseMultipleStmt } from 'Src/parser/nodes/stmt'
import { TypeNode, parseTypeNode } from 'Src/parser/nodes/type'

export class FunctionParam {
	constructor(private readonly _name: prim.Identifier, private readonly _type: TypeNode) {}

	get name(): prim.Identifier {
		return this._name
	}

	get type(): TypeNode {
		return this._type
	}
}

function parseFunctionParams(s: Source): prim.ListNode<FunctionParam> {
	const params = []

	s.forceSeek('(')
	let first = true

	for (;;) {
		s.skipSpaces()
		if (s.cch === ')') {
			s.next()
			break
		}

		if (first) {
			first = false
		} else {
			s.forceSeek(',')
			s.skipSpaces()
		}

		const name = prim.parseIdentifier(s)
		s.skipSpaces()
		const type = parseTypeNode(s)
		params.push(new FunctionParam(name, type))
	}

	return new prim.ListNode(params)
}

export class DefFunction {
	constructor(
		private readonly _name: prim.Identifier,
		private readonly _params: prim.ListNode<FunctionParam>,
		private readonly _body: MultipleStmt,
		private readonly _resultType: TypeNode
	) {}

	get name(): prim.Identifier {
		return this._name
	}

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

export function parseDefFunction(s: Source): DefFunction {
	s.forceWord('def')
	s.skipSpaces()

	const id = prim.parseIdentifier(s)
	s.skipSpaces()

	const params = parseFunctionParams(s)
	s.skipSpaces()

	const resultType = parseTypeNode(s)
	s.skipSpaces()

	const body = parseMultipleStmt(s)

	return new DefFunction(id, params, body, resultType)
}
