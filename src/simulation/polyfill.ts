export type int = bigint;
export type float = number;
export type bool = boolean;
export function toInt(v: float): bigint {
  return BigInt(v);
}

export function max(...values: bigint[]): bigint {
  if (values.length < 1) {
    return BigInt(-Infinity);
  }

  let maxValue = values.shift()!;

  for (const value of values) {
    if (value > maxValue) {
      maxValue = value;
    }
  }

  return maxValue;
}

export function min(...values: bigint[]): bigint {
  if (values.length < 1) {
    return BigInt(Infinity);
  }

  let minValue = values.shift()!;

  for (const value of values) {
    if (value < minValue) {
      minValue = value;
    }
  }

  return minValue;
}
