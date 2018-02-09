import { Variable } from './../variable';
import  {
	createInequalityHash,
	solveInequalityEquation,
	flipSign
} from './inequality';

  const a = new Variable('a', 0, 1, 5);
  const b = new Variable('b', 0, 1, 5);
  const c = new Variable('c', 0, 1, 5);
  const x = new Variable('x', 0, -100, 100);
  const variables: Variable[] = [a, b, c, x];

it('should create inEquality equation from Equality equation', () => {
    expect(createInequalityHash("x + y = z")).toBe("x + y > z");
  });

it('should solve inEquality when calling solveInequalityEquation(equation, variableToSolve)', () => {
    const equation1 = 'x + a = 0';
    const equation2 = 'a = b - c';
    const variableToSolve1: Variable = new Variable('x', 0, 0, 0);
    const variableToSolve2: Variable = new Variable('b', 0, 0, 0);
    const result1: string = solveInequalityEquation(Object({ equation: equation1, inEqSymbol: '>=' }), variableToSolve1.name);
    expect(result1.toString()).toBe('x >= -a');

    const result2: string = solveInequalityEquation(Object({ equation: equation2, inEqSymbol: '<' }), variableToSolve2.name);

    	expect(result2.toString()).toBe('b > a+c');
  });

it('should flip sign when caling flipsign(hash))', () => {
		const hash = Object({ equation: 'a = b - c', inEqSymbol: '>=' });
		let hashWithFlippedSign = flipSign(hash, "a");
		let expectedHash = Object({ equation: 'a = b - c', inEqSymbol: '<=' })
		expect(hashWithFlippedSign).toBe(expectedHash);
	});
