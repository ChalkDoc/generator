export class Variable {
	constructor(
		public name: string,
		public dataType: string = "Dec",
		public decPoint: number = 2, public min: number = 0,
		public max: number = 10){}
}
