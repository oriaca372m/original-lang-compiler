import * as u from 'Src/utils'
import * as nodes from 'Src/ct-tree/nodes'
import { CtFunc } from 'Src/ct-tree/ct-func'

export function interpret(program: nodes.Program, _expr?: nodes.CtExpr): nodes.CtImmediateValue {
	const testCtFunc = program.ctFuncs.find((x) => x.name === 'testCt') ?? u.notImplemented()
	return interpretFunc(testCtFunc, [])
}

function interpretFunc(func: CtFunc, _args: nodes.CtImmediateValue[]): nodes.CtImmediateValue {
	const def = func.funcDef ?? u.unreachable()
	let v = new nodes.CtImmediateValue(1)
	for (const expr of def.body.exprs) {
		v = interpretExpr(expr)
	}
	return v
}

function interpretExpr(expr: nodes.CtExpr): nodes.CtImmediateValue {
	const v = expr.value
	if (v instanceof nodes.CtApplyFunc) {
		return interpretApplyFunc(v)
	} else if (v instanceof nodes.CtImmediateValue) {
		return v
	} else {
		u.notImplemented()
	}
}

function interpretApplyFunc(applyFunc: nodes.CtApplyFunc): nodes.CtImmediateValue {
	const func = interpretExpr(applyFunc.funcExpr).value as CtFunc
	u.assert(func instanceof CtFunc)

	if (func.name === 'add') {
		u.assert(applyFunc.args.length == 2)
		const v1 = interpretExpr(applyFunc.args[0]).value as number
		const v2 = interpretExpr(applyFunc.args[1]).value as number

		return new nodes.CtImmediateValue(v1 + v2)
	}

	return interpretFunc(
		func,
		applyFunc.args.map((x) => interpretExpr(x))
	)
}
