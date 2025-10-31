import type { CountArgs, CreateArgs, DeleteArgs, FindArgs, FindUniqueArgs, IDatabase, ITable, UpdateArgs } from "../IDatabase";

export class PrismaAdapter implements IDatabase {
	connect(): Promise<void> {
		throw new Error("Method not implemented.");
	}
	disconnect(): Promise<void> {
		throw new Error("Method not implemented.");
	}
	table<I, O = I>(table: string): ITable<I, O> {
		return new PrismaTable<I, O>(table);
	}
}

export class PrismaTable<I, O = I> implements ITable<I, O> {
	constructor(private readonly prisma: string) {}

	create(args: CreateArgs<I>): Promise<O> {
		throw new Error("Method not implemented.");
	}
	findMany(args?: FindArgs<I> | undefined): Promise<I[]> {
		throw new Error("Method not implemented.");
	}
	findUnique(args: FindUniqueArgs<I>): Promise<O | null> {
		throw new Error("Method not implemented.");
	}
	update(args: UpdateArgs<I>): Promise<I> {
		throw new Error("Method not implemented.");
	}
	delete(args: DeleteArgs<I>): Promise<I> {
		throw new Error("Method not implemented.");
	}
	count(args: CountArgs<I>): Promise<number> {
		throw new Error("Method not implemented.");
	}
}
