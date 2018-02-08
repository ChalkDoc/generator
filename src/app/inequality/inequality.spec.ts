import { Variable } from './../variable';
import  {
	createInequalityHash,
	solveInequalityEquation,
} from './inequality';

  const a = new Variable('a', 0, 1, 5);
  const b = new Variable('b', 0, 1, 5);
  const c = new Variable('c', 0, 1, 5);
  const x = new Variable('x', 0, -100, 100);
  const variables: Variable[] = [a, b, c, x];

it('should create inEquality equation from Equality equation', () => {
    expect(createInequalityHash("x + y = z")).toBe("x + y > z");
  });

it('should return "[-a]" when calling simplifyEquation(equation, variableToSolve)', () => {
    const equation = 'x + a = 0';
    const variableToSolve: Variable = new Variable('x', 0, 0, 0);

    const simplifiedEquation: string = solveInequalityEquation(Object({ equation: equation, inEqSymbol: '>=' }), variableToSolve.name);
    expect(simplifiedEquation.toString()).toBe('x >= -a');
  });
