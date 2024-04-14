import { deepAccess } from './deep-access';
import { DTColumns } from '../types';

export const filterData = <T>(
  rows: T[],
  searchTerm: string,
  columns: DTColumns[]
): T[] => {
  if (!searchTerm) return rows;
  const lowerCaseSearchTerms = searchTerm
    .toLowerCase()
    .split(' ')
    .filter((term) => term.length > 0);
  return rows.filter((item) => {
    const concatenatedValues = columns
      .filter((column) => column.searchable !== false && column.data)
      .map((column) => {
        const value = deepAccess(item, column.data || '');
        return value ? value.toString().toLowerCase() : '';
      })
      .join(' ');
    return lowerCaseSearchTerms.some((term) =>
      concatenatedValues.includes(term)
    );
  });
};
