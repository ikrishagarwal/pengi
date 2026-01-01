import { Command, RegisterCommand } from '@skyra/http-framework';
import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { ComponentType } from 'discord-api-types/v10';
import { appendDev } from '#utils/functions';

@RegisterCommand((builder) =>
	builder //
		.setName('invite')
		.setDescription(appendDev('Get the invitation link.'))
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const actionRow: any = {
			type: ComponentType.ActionRow,
			components: [
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Invite')
					.setURL('https://discord.com/oauth2/authorize?client_id=1081171110613237770&permissions=137439332416&scope=bot')
					.toJSON()
			]
		};

		return interaction.reply({ content: 'Thanks for inviting me! UwU', components: [actionRow] });
	}
}
