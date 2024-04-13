import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

interface NavigatorConnection {
	effectiveType?: string;
	saveData?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PreloadStrategy implements PreloadingStrategy {
	preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
		const data = route.data;
		if (!data || !data['module']) {
			console.error(`%cModule without data: ${route.path}`, 'font-size:60px; font-weight: bold;');
			return EMPTY;
		}
		const conn =
			typeof navigator !== 'undefined'
				? (navigator as Navigator & { connection?: NavigatorConnection }).connection
				: undefined;
		if (conn) {
			if ((conn.effectiveType || '').includes('2g') || conn.saveData) return EMPTY;
		}
		if (route.data && route.data['preload'] === false) {
			return EMPTY;
		}

		return load();
	}
}
