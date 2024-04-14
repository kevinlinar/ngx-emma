import { DTOptions } from '../types/dt-options';
import { DTLangEs } from './lang/es';

export const DTOptionsDefault: DTOptions<unknown> = {
  columns: [],
  data: [],
  serverSide: false,
  language: DTLangEs,
};
