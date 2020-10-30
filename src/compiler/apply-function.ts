import * as u from 'Src/utils'
import * as ast from 'Src/ast'
import { Label, Asm, r, imm } from 'Src/assembler'
import { compileExpr } from 'Src/compiler/compiler'
import { FunctionState } from 'Src/compiler/state'

export const builtInFunctions: { [key: string]: Label } = {
	'+': new Label('__builtIn_add'),
	'*': new Label('__builtIn_mul'),
	'==': new Label('__builtIn_equals2nums'),
	'<': new Label('__builtIn_lesserThan'),
	print: new Label('__builtIn_print_number'),
	print_string_length: new Label('__builtIn_print_string_length'),
	strlen: new Label('__builtIn_strlen'),
}

// TODO: 関数を特定する式を先に評価されるように (現状は引数の後に評価される)
export function compileApplyFunction(a: Asm, s: FunctionState, apply: ast.ApplyFunction): void {
	const core = apply.funcType

	// 戻り値分の領域を確保
	a.c('戻り値の領域確保')
	a.sub(imm(core.resultType.size), r.rsp)

	for (const opexpr of apply.args) {
		compileExpr(a, s, opexpr)
	}

	a.c('呼ぶ関数のアドレス計算')
	compileExpr(a, s, apply.funcExpr)

	a.c('関数の呼び出し')
	a.pop(r.rax)
	a.callIndirect(r.rax)

	const totalParamSize = u.l.sumBy(core.argTypes, (x) => x.size)
	a.add(imm(totalParamSize), r.rsp)
}
