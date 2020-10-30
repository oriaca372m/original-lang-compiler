import l from 'lodash'
import { inspect as inspectUtil } from 'util'

export function unreachable(): never
export function unreachable(_: never): never

export function unreachable(_?: unknown): never {
	throw Error('This must never happen!')
}

export function notImplemented(): never {
	throw Error('Not implemented!')
}

export function assert(cond: boolean, msg?: string): void {
	if (!cond) {
		console.trace(`assertion failed: ${msg ?? ''}`)
		process.exit(1)
	}
}

export function inspect(object: unknown): string {
	return inspectUtil(object, { depth: null, colors: true })
}

export { l }
