export type SelectArgs<T> = (keyof T)[];
export type OmitArgs<T> = (keyof T)[];

export type CreateArgs<T> = {
	data: T;
	select?: SelectArgs<T>;
	omit?: OmitArgs<T>;
};

export type FindArgs<T> = {
	where?: Partial<T>;
	offset?: number;
	limit?: number;
	select?: SelectArgs<T>;
	omit?: OmitArgs<T>;
};

export type FindUniqueArgs<T> = {
	where: Partial<T>;
	select?: SelectArgs<T>;
	omit?: OmitArgs<T>;
};

export type UpdateArgs<T> = {
	where: Partial<T>;
	data: Partial<T>;
	select?: SelectArgs<T>;
	omit?: OmitArgs<T>;
};

export type DeleteArgs<T> = {
	where: Partial<T>;
	select?: SelectArgs<T>;
	omit?: OmitArgs<T>;
};

export type CountArgs<T> = {
	where?: Partial<T>;
};

export interface ITable<I, O> {
	create(args: CreateArgs<I>): Promise<O>;
	findMany(args?: FindArgs<I>): Promise<I[]>;
	findUnique(args: FindUniqueArgs<I>): Promise<O | null>;
	update(args: UpdateArgs<I>): Promise<I>;
	delete(args: DeleteArgs<I>): Promise<I>;
	count(args: CountArgs<I>): Promise<number>;
}

export interface IDatabase {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	table<I, O = I>(table: string): ITable<I, O>;
}
