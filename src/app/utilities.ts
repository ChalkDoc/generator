
  export function findRange(max: number, min: number, decPoint: number): number {
    let range = (max - min) * (Math.pow(10, decPoint)) + 1;

    return range;
  }
