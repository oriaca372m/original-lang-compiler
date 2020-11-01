import * as u from 'Src/utils'
import * as ast from 'Src/ast'
import { Asm, r, imm, addr } from 'Src/assembler'
import { pushVoidValue } from 'Src/compiler/utils'
import { compileExpr, compileMultipleExpr } from 'Src/compiler/compiler'
import { FunctionState } from 'Src/compiler/state'

export function compileWhile(a: Asm, s: FunctionState, whileNode: ast.While): void {
	a.c('while')

	const whileStart = a.s.labelManager.getLabel()
	const whileEnd = a.s.labelManager.getLabel()

	s.whileTable.set(whileNode, { endLabel: whileEnd })

	a.defLabel(whileStart)
	a.push(r.r15)
	a.mov(r.rsp, r.r15)

	compileExpr(a, s, whileNode.cond)
	a.pop(r.rax)
	a.cmp(imm(0), r.rax)
	a.je(addr(whileEnd))

	a.nl()
	a.c('while body')
	compileMultipleExpr(a, s, whileNode.body)
	// スタックから値をどける
	a.add(imm(whileNode.body.type.core.size), r.rsp)
	a.jmp(addr(whileStart))

	a.nl()
	a.c('whileの終わり')
	a.defLabel(whileEnd)
	a.mov(r.r15, r.rsp)
	a.pop(r.r15)
	pushVoidValue(a)
}

export function compileBreak(a: Asm, s: FunctionState, node: ast.Break): void {
	const whileInfo = s.whileTable.get(node.target) ?? u.unreachable()
	a.jmp(addr(whileInfo.endLabel))
}
