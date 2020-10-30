import * as u from 'Src/utils'
import { Register, Asm, r, rel, imm, addr } from 'Src/assembler'

export function pushVoidValue(a: Asm): void {
	a.push(imm(0xdead))
}

type Position = {
	base: Register
	offset: number
}

export function copyValue(a: Asm, from: Position, to: Position, size: number): void {
	u.assert(8 <= size && size % 8 === 0, `unsupported size ${size} passed`)

	a.c(`copy ${size} bytes`)
	for (let i = 0; i < size / 8; i++) {
		a.mov(rel(from.base, addr(from.offset + i * 8)), r.rax)
		a.mov(r.rax, rel(to.base, addr(to.offset + i * 8)))
	}
}
