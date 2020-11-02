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

	get tryCch(): string | ParseError {
		const ch = this._source[this._idx]
		if (ch === undefined) {
			return new ParseError(this, 'unexpected EOF.')
		}

		return ch
	}

	// current character
	get cch(): string {
		const ch = this.tryCch
		if (ch instanceof ParseError) {
			throw ch
		}
		return ch
	}

	get isEof(): boolean {
		return this._source[this._idx] === undefined
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

	trySeek(ch: string): true | ParseError {
		const inCh = this.cch
		if (inCh !== ch) {
			return new ParseError(this, `expect '${ch}' but '${inCh}'.`)
		}
		this._idx++
		return true
	}

	forceSeek(ch: string): void {
		const err = this.trySeek(ch)
		if (err !== true) {
			throw err
		}
	}

	tryWord(str: string): true | ParseError {
		for (const ch of str) {
			const err = this.trySeek(ch)
			if (err !== true) {
				return err
			}
		}

		return true
	}

	// 連続して正規表現がマッチする文字列を返す
	// 空ならエラー
	tryToken(regexp: RegExp): string | ParseError {
		let str = ''

		for (;;) {
			const ch = this.tryCch
			if (ch instanceof ParseError || !regexp.test(ch)) {
				break
			}
			str += ch
			this.next()
		}

		if (str === '') {
			return new ParseError(this, 'got a empty token.')
		}

		return str
	}
}
