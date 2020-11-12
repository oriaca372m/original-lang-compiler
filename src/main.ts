import * as p from 'Src/parser'
// import { makeProgram } from 'Src/ast'
import { makeProgram as makeCtProgram } from 'Src/ct-tree'
// import { compileProgram } from 'Src/compiler/compiler'
// import { Asm } from 'Src/assembler'
import * as fs from 'fs'
import * as util from 'util'

function main() {
	if (process.argv.length <= 3) {
		console.error('usage: program <input> <output>')
		process.exit(1)
	}

	const srcStr = fs.readFileSync(process.argv[2], 'utf-8')
	const s = new p.Source(srcStr)

	let program
	try {
		program = p.parseProgram(s)
	} catch (e) {
		if (e instanceof p.ParseError) {
			console.error(e.humanRedable())
		}
		throw e
	}

	console.log(util.inspect(program, { depth: null, colors: true }))

	const ctTree = makeCtProgram(program)
	console.log(util.inspect(ctTree, { depth: null, colors: true }))

	// const ast = makeProgram(program)
	// console.log(util.inspect(ast, { depth: null, colors: true }))
	//
	// const a = new Asm()
	// compileProgram(a, ast)
	//
	// fs.writeFileSync(process.argv[3], a.toString())
}

main()
