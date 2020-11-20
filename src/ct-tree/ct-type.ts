export class CtType {
	readonly _name: string

	constructor(name: string) {
		this._name = `!CtType__${name}`
	}

	get name(): string {
		return this._name
	}

	equals(other: CtType): boolean {
		return this.name === other.name
	}
}

export class CtFuncType extends CtType {
	constructor(private readonly _argTypes: CtType[], private readonly _resultType: CtType) {
		super(
			(() => {
				const typeNames = [_resultType.name, ..._argTypes.map((x) => x.name)]
				return `__FunctionType<${typeNames.join(', ')}>`
			})()
		)
	}

	get argTypes(): CtType[] {
		return this._argTypes
	}

	get resultType(): CtType {
		return this._resultType
	}
}

export const intCtType = new CtType('__Int')
export const rtTypeCtType = new CtType('__RtType')
