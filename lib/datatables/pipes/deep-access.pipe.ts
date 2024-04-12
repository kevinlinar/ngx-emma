import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
	name: 'appDeepAccess',
	standalone: true,
})
export class DeepAccessPipe implements PipeTransform {
	transform<T, R = unknown>(obj: T, path: string): R | null {
		if (!path) return obj as unknown as R;
		const properties = path.split('.');
		const result = properties.reduce((acc: unknown, prop: string): unknown => {
			if (acc && Object.prototype.hasOwnProperty.call(acc, prop)) {
				return (acc as Record<string, unknown>)[prop];
			}
			return undefined;
		}, obj);
		return result as R;
	}
}
