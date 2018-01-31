export class Variable {
  constructor(
    public name: string,
		public decPoint: number = 0,
	  public min: number = 0,
	  public max: number = 5,
	  public containsImaginary = false,
	  public solveForThisVariable = false,
	  public answerMeetsAllSpecification = false,
  ) { }
}
