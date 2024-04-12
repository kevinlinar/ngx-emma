import { DTClassName } from './dt-class-name';
import { DTColumns } from './dt-columns';
import { DTRow } from './dt-row';
import { DTLanguage } from './dt-language';
import { DTHttp } from './dt-http';

export interface DTOptions {
  columns: DTColumns[];
  data?: DTRow[];
  serverSide?: boolean;
  http?: DTHttp;
  className?: DTClassName;
  language?: DTLanguage;
}
