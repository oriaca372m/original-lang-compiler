import * as nodes from 'Src/ct-tree/nodes'

export function interpret(_program: nodes.Program, _expr?: nodes.CtExpr): nodes.CtImmediateValue {
	return new nodes.CtImmediateValue(1)
}
