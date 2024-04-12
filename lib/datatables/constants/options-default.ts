import { DTOptions } from '../types/dt-options';
import { DTLangEs } from './lang/es';

export const DTOptionsDefault: DTOptions = {
  columns: [],
  data: [],
  http: {
    url: '',
    method: 'post',
    headers: {},
    data: null,
  },
  serverSide: true,
  language: DTLangEs,
};
