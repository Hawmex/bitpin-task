export type PrimitiveValue = string | number | boolean | null;

export type PrimitiveArray =
  | (string | null)[]
  | (number | null)[]
  | (boolean | null)[];

export type JSONValue =
  | PrimitiveValue
  | PrimitiveArray
  | { [x: string]: JSONValue }
  | { [x: string]: JSONValue }[];
