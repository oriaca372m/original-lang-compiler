import { Asm, imm, r, rel } from 'Src/assembler'
import * as ast from 'Src/ast'
import { compileExpr } from 'Src/compiler/compiler'
import { FunctionState } from 'Src/compiler/state'
import { copyValue } from 'Src/compiler/utils'

function compileIndexAccess8(a: Asm, astNode: ast.ApplyApplicative): void {
	const [array] = astNode.args

	if (array.type.vc.isRValue) {
		const arrSize = array.type.core.size
		// index
		a.pop(r.rax)

		// 要素のアドレス
		a.lea(rel(r.rsp, r.rax, 8), r.rsi)

		// 要素をコピー
		a.add(imm(arrSize - 8), r.rsp)
		copyValue(a, { base: r.rsi, offset: 0 }, { base: r.rsp, offset: 0 }, 8)
	} else {
		// index
		a.pop(r.rax)
		// address
		a.pop(r.rsi)
		a.lea(rel(r.rsi, r.rax, 8), r.rsi)
		a.push(r.rsi)
	}
}

function compileIndexAccessAny(a: Asm, astNode: ast.ApplyApplicative): void {
	const [array] = astNode.args
	const elmSize = astNode.type.core.size

	if (array.type.vc.isRValue) {
		const arrSize = array.type.core.size
		// index
		a.pop(r.rax)

		// index * elmSize
		a.mov(imm(elmSize), r.r11)
		a.mul(r.r11)

		// 要素のアドレス
		a.add(r.rsp, r.rax)

		// copyValueで%raxは破壊されるので退避
		a.mov(r.rax, r.rsi)

		// 要素をコピー
		a.add(imm(arrSize - elmSize), r.rsp)
		copyValue(a, { base: r.rsi, offset: 0 }, { base: r.rsp, offset: 0 }, elmSize)
	} else {
		// index
		a.pop(r.rax)

		// address
		a.pop(r.rsi)

		// index * elmSize + address
		a.mov(imm(elmSize), r.r11)
		a.mul(r.r11)
		a.add(r.rax, r.rsi)

		a.push(r.rsi)
	}
}

export function compileIndexAccess(a: Asm, s: FunctionState, astNode: ast.ApplyApplicative): void {
	const [array, index] = astNode.args

	compileExpr(a, s, array)
	compileExpr(a, s, index)
	a.c('index access')

	if (astNode.type.core.size === 8) {
		compileIndexAccess8(a, astNode)
	} else {
		compileIndexAccessAny(a, astNode)
	}
}
