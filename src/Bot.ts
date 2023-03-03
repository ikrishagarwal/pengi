import '#lib/setup';
import { envIsDefined, envParseInteger, envParseString } from '@skyra/env-utilities';
import { Client, container, Registry } from '@skyra/http-framework';
import { green, magentaBright, magenta, cyanBright } from 'colorette';

async function main() {
	const client = new Client();
	const registry = new Registry({
		token: envParseString('DISCORD_TOKEN')
	});

	await registry.load();

	if (envIsDefined('GUILD_ID')) {
		await registry.registerGlobalCommandsInGuild(envParseString('GUILD_ID'));
	} else {
		await registry.registerGlobalCommands();
	}

	await client.load();

	client.on('error', (error) => container.logger.error(error));

	const address = envParseString('ADDRESS');
	const port = envParseInteger('HTTP_PORT', 3000);

	void client.listen({ address, port });

	printBanner();
}

function printBanner() {
	const success = green('+');

	const llc = magentaBright;
	const blc = magenta;

	const blankLine = llc('');

	// Offset Pad
	const pad = ' '.repeat(7);

	console.log(
		cyanBright(
			String.raw`
${blankLine}
${blankLine}${'\u200B  '}_______    _______  _____  ___    _______   __     
${blankLine}  |   __ "\  /"     "|(\"   \|"  \  /" _   "| |" \    
${blankLine}  (. |__) :)(: ______)|.\\   \    |(: ( \___) ||  |   
${blankLine}  |:  ____/  \/    |  |: \.   \\  | \/ \      |:  |   
${blankLine}  (|  /      // ___)_ |.  \    \. | //  \ ___ |.  |   
${blankLine} /|__/ \    (:      "||    \    \ |(:   _(  _|/\  |\  
${blankLine}(_______)    \_______) \___|\____\) \_______)(__\_|_) 
${blankLine}
${blankLine} ${pad}[${success}] Gateway
${blankLine}${process.env.NODE_ENV === 'production' ? '' : ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}`}
		`.trim()
		)
	);
}

void main();
