import { appendDev } from '#utils/functions';
import { Command, RegisterCommand } from '@skyra/http-framework';
import { EmbedBuilder } from 'discord.js';

@RegisterCommand((builder) =>
	builder //
		.setName('reddit')
		.setDescription(appendDev('Extract reddit image/video from URL.'))
		.addStringOption((option) =>
			option //
				.setName('post')
				.setDescription('URL of the reddit post.')
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction, option: Option) {
		if (!option.post) return interaction.reply({ content: 'Please provide a URL.' });

		try {
			const index = option.post.includes('?') ? option.post.indexOf('?') - 1 : option.post.length;
			const url = `${option.post.substring(0, index)}.json`;
			const post = await this.fetchPost(url);

			const mediaURL = post.secure_media?.reddit_video?.fallback_url ?? post.url;

			const embed = new EmbedBuilder() //
				.setTitle(post.title.length > 256 ? `${post.title.substring(0, 256)}...` : post.title)
				.setImage(mediaURL)
				.setURL(`https://reddit.com${post.permalink}`)
				.setDescription(`[Click for media link](${mediaURL})\n${post.selftext}`);
			return interaction.reply({ embeds: [embed.toJSON()] });
		} catch (e) {
			this.container.logger.error('Error while trying to fetch post: ', e);
			return interaction.reply({ content: "An error occurred while trying to fetch the post. Please recheck the URL if it's correct." });
		}
	}

	private async fetchPost(url: string) {
		const response = await fetch(url);
		const json = await response.json();

		return json[0].data.children[0].data;
	}
}

interface Option {
	post: string;
}
