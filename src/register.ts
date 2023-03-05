import '#root/config';
import { Registry } from '@skyra/http-framework';

async function main() {
	const registry = new Registry({
		token: process.env['DISCORD_TOKEN']
	});

	await registry.load();
	await registry.registerGlobalCommands();
}

void main();
