import { Pipe, type PipeTransform } from '@angular/core';
import { deepAccess } from '../utils/deep-access';

@Pipe({
  name: 'appDeepAccess',
  standalone: true,
})
export class DeepAccessPipe implements PipeTransform {
  transform<T, R = unknown>(obj: T, path: string): R | null {
    return deepAccess(obj, path);
  }
}
