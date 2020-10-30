import { ParseError } from 'Src/parser/error'

export class Source {
	private _idx = 0
	constructor(private readonly _source: string) {}

	get source(): string {
		return this._source
	}

	get index(): number {
		return this._idx
	}

	get cchOrUndefined(): string | undefined {
		return this._source[this._idx]
	}

	// current character
	get cch(): string {
		const ch = this.cchOrUndefined
		if (ch === undefined) {
			throw new ParseError(this, 'unexpected EOF.')
		}
		return ch
	}

	get isEof(): boolean {
		return this.cchOrUndefined === undefined
	}

	next(): void {
		this._idx++
	}

	clone(): Source {
		const s = new Source(this._source)
		s._idx = this._idx
		return s
	}

	update(s: Source): void {
		this._idx = s._idx
	}

	// helpers

	skipRegExp(regexp: RegExp): void {
		while (regexp.test(this._source[this._idx])) {
			this._idx += 1
		}
	}

	skipSpaces(): void {
		this.skipRegExp(/[\t ]/)
	}

	forceSeek(ch: string): void {
		const inCh = this.cch
		if (inCh !== ch) {
			throw new ParseError(this, `expect '${ch}' but '${inCh}'.`)
		}
		this._idx++
	}

	forceWord(str: string): void {
		for (const ch of str) {
			this.forceSeek(ch)
		}
	}

	// 連続して正規表現がマッチする文字列を返す
	// 空ならエラー
	getToken(regexp: RegExp): string {
		let str = ''

		for (;;) {
			const ch = this.cchOrUndefined
			if (ch === undefined || !regexp.test(ch)) {
				break
			}
			str += ch
			this.next()
		}

		if (str === '') {
			throw new ParseError(this, 'got a empty token.')
		}

		return str
	}
}
