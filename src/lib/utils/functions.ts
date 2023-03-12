import { dev } from '#utils/constants';

export function appendDev(message: string) {
	return `${dev ? '[DEV] ' : ''}${message}`;
}
