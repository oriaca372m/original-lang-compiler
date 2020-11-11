import * as p from 'Src/parser'

import * as nodes from 'Src/ast/nodes'

export function makeImmdiateValue(value: p.NumberNode | p.StringNode): nodes.ImmediateValue {
	return new nodes.ImmediateValue(value.value)
}
