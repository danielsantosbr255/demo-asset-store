const INFO_COLOR = "\x1b[33m";
const WARN_COLOR = "\x1b[33m";
const ERROR_COLOR = "\x1b[31m";

export const logger = {
	info: (...args: unknown[]) => console.info(`${INFO_COLOR}[INFO]\x1b[0m`, ...args),
	warn: (...args: unknown[]) => console.warn(`${WARN_COLOR}[WARN]\x1b[0m`, ...args),
	error: (...args: unknown[]) => console.error(`${ERROR_COLOR}[ERROR]\x1b[0m`, ...args),
};
