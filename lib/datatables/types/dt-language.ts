export interface DTLanguagePaginate {
	first: string;
	last: string;
	next: string;
	previous: string;
}

export interface DTLanguageAria {
	sortAscending: string;
	sortDescending: string;
	paginate?: DTLanguagePaginate | undefined;
}

export interface DTLanguage {
	emptyTable?: string | undefined;
	info?: string | undefined;
	infoEmpty?: string | undefined;
	infoFiltered?: string | undefined;
	infoPostFix?: string | undefined;
	decimal?: string | undefined;
	thousands?: string | undefined;
	lengthMenu?: string | undefined;
	loadingRecords?: string | undefined;
	processing?: string | undefined;
	search?: string | undefined;
	searchPlaceholder?: string | undefined;
	zeroRecords?: string | undefined;
	paginate?: DTLanguagePaginate | undefined;
	aria?: DTLanguageAria | undefined;
	url?: string | undefined;
	select: {
		rows: {
			_: string;
			0: string;
			1: string;
		};
	};
}
