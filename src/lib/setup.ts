import '#root/config';
import { dev } from '#utils/constants';
import { container } from '@skyra/http-framework';

import { Logger } from '@skyra/logger';

container.logger = new Logger({
	level: dev ? Logger.Level.Trace : Logger.Level.Info
});

declare module '@sapphire/pieces' {
	export interface Container {
		logger: Logger;
	}
}
