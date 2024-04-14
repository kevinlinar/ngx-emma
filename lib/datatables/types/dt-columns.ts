import { DTClassName } from './dt-class-name';

export interface DTColumns {
  title: string | undefined;
  data: string | null | undefined;
  name?: string | undefined;
  className?: Pick<DTClassName, 'th' | 'td'>;
  orderable?: boolean;
  searchable?: boolean;
  visible?: boolean;
  width?: string;
  ordered?: string;
}
