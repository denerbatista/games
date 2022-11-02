import { Dispatch, SetStateAction } from "react";

export interface OrderSettingsProviderData {
	orderBy: string;
	orderDirection: string;
	category: string;
	pageLength: number;
	setOrderBy: Dispatch<SetStateAction<string>>;
	setOrderDirection: Dispatch<SetStateAction<string>>;
	setCategory: Dispatch<SetStateAction<string>>;
	setPageLenght: Dispatch<SetStateAction<number>>;
}