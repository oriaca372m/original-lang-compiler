import * as prim from 'Src/ast/nodes/primitive'

import { ValueType } from 'Src/ast/langtype'

export class CompileTimeValue implements prim.TypedNode {
	get type(): ValueType {
		throw 'CompileTimeValueのtypeを取得することは出来ない'
	}
}
