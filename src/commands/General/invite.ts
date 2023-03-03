import { Command, RegisterCommand } from '@skyra/http-framework';
import { APIActionRowComponent, APIMessageActionRowComponent, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ComponentType } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	builder //
		.setName('invite')
		.setDescription('Get the invitation link.')
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const actionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
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
