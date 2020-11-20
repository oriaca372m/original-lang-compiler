import { CtFunc } from 'Src/ct-tree/ct-func'

import { NameResolver } from './name-resolver'

export class BlockState {
	constructor(
		private readonly _fds: FuncDefState,
		private readonly _nameResolver: NameResolver
	) {}

	get ps(): ProgramState {
		return this._fds.ps
	}

	get fds(): FuncDefState {
		return this._fds
	}

	get nameResolver(): NameResolver {
		return this._nameResolver
	}

	createChild(): BlockState {
		return new BlockState(this.fds, this.nameResolver.createChild())
	}
}

export class FuncDefState {
	private readonly _nameResolver: NameResolver

	constructor(private readonly _ps: ProgramState, private readonly _ctFunc: CtFunc) {
		this._nameResolver = _ps.nameResolver.createChild()
	}

	get ps(): ProgramState {
		return this._ps
	}

	get ctFunc(): CtFunc {
		return this._ctFunc
	}

	get nameResolver(): NameResolver {
		return this._nameResolver
	}

	createBlockState(): BlockState {
		return new BlockState(this, this.nameResolver.createChild())
	}
}

export class ProgramState {
	private readonly _nameResolver: NameResolver

	constructor() {
		const rootNameResolver = new NameResolver()
		this._nameResolver = rootNameResolver.createChild()
	}

	get nameResolver(): NameResolver {
		return this._nameResolver
	}

	createFuncDefState(ctFunc: CtFunc): FuncDefState {
		return new FuncDefState(this, ctFunc)
	}
}
