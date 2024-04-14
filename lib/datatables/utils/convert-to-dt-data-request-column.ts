import { DTColumns, DTDataRequestColumn, DTDataRequestSearch } from '../types';

export const convertToDTDataRequestColumn = (
  columns: DTColumns[],
  search: DTDataRequestSearch
): DTDataRequestColumn[] => {
  return columns.map((col) => {
    const data = col.data ?? '';
    const name = col.name ?? '';
    const searchable = col.searchable ?? false;
    const orderable = col.orderable ?? false;
    return {
      data,
      name,
      searchable,
      orderable,
      search,
    };
  });
};
