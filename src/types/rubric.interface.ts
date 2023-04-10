interface IRubric {
	id: number;
	title: string;
	url: string;
	children?: IRubric[];
	count: number;
}

export type { IRubric };
