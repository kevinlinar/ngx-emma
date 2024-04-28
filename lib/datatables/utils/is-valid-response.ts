import { DTHttpResponse } from '../types';

export const isValidResponse = <T>(response: DTHttpResponse<T>): boolean => {
  return (
    typeof response.recordsTotal === 'number' &&
    typeof response.recordsFiltered === 'number' &&
    Array.isArray(response.data)
  );
};
