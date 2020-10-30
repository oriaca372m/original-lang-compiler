import { Source } from 'Src/parser/source'

export class ParseError extends Error {
	private readonly _source: Source

	get source(): Source {
		return this._source
	}

	constructor(source: Source, msg: string) {
		super(msg)
		this._source = source.clone()
	}

	humanRedable(): string {
		const src = this.source.source
		const idx = this.source.index

		const firstIndex = Math.max(0, src.lastIndexOf('\n', idx))

		let lastIndex = src.indexOf('\n', idx)
		if (lastIndex === -1) {
			lastIndex = src.length
		}

		return `${src.substring(firstIndex, lastIndex)}\n${this.message}`
	}
}
