export class Variable {
	constructor(public name: string, public isInt: boolean = false, public isDec: boolean = false, public decPoint: number = 0, public min: number = 0, public max: number = 10){}
}
