import { Label } from 'Src/assembler/asm'

export class LabelManager {
	private _counter = 0

	getLabel(): Label {
		const label = new Label(`__c_label_${this._counter}`)
		this._counter++
		return label
	}
}

export class StaticStringTable {
	constructor(private readonly _labelManager: LabelManager) {}

	private _list: [Label, string][] = []

	private addNewString(str: string): Label {
		const label = this._labelManager.getLabel()
		this._list.push([label, str])
		return label
	}

	getLabel(str: string): Label {
		const elm = this._list.find((x) => x[1] === str)
		if (elm === undefined) {
			return this.addNewString(str)
		} else {
			return elm[0]
		}
	}

	getAllString(): [Label, string][] {
		return this._list
	}
}

export class State {
	private _labelManager: LabelManager = new LabelManager()
	private _sst: StaticStringTable = new StaticStringTable(this._labelManager)

	get labelManager(): LabelManager {
		return this._labelManager
	}

	get sst(): StaticStringTable {
		return this._sst
	}
}
