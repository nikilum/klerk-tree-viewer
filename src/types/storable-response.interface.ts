interface IStorableResponse<
	ResponseType = any,
	Actions extends string = string,
> {
	response: ResponseType;
	actions: {
		[action in Actions]: () => void;
	};
}

export type { IStorableResponse };
