import { DTDataRequestOrder } from '../types';

export const convertToDTDataRequestOrder = (
  input: [number, string][]
): DTDataRequestOrder[] => {
  return input.map(([column, dir]) => ({
    column,
    dir,
  }));
};
