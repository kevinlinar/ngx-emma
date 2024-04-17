import { DTColumns } from '../types';
import { deepAccess } from './deep-access';

export const localSort = <T>(
  columns: DTColumns[],
  order: [number, string][],
  rows: T[]
): T[] => {
  const multiSortComparator = (a: T, b: T): number => {
    for (const [columnIndex, dir] of order) {
      if (!columns[columnIndex]) continue;
      const { data } = columns[columnIndex];
      if (!data) continue;
      const dirMultiplier = dir === 'asc' ? 1 : -1;
      const aValue = deepAccess(a, data);
      const bValue = deepAccess(b, data);

      if (aValue == null && bValue == null) continue;
      if (aValue == null) return 1 * dirMultiplier;
      if (bValue == null) return -1 * dirMultiplier;

      if (aValue < bValue) return -1 * dirMultiplier;
      if (aValue > bValue) return 1 * dirMultiplier;
    }
    return 0;
  };
  const sortedData = [...rows].sort(multiSortComparator);
  return sortedData;
};
