import { container } from '@sapphire/pieces';
import { appendDev } from '#utils/functions';
import { Command, RegisterCommand } from '@skyra/http-framework';
import { EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

@RegisterCommand((builder: SlashCommandBuilder) =>
	builder //
		.setName('reddit')
		.setDescription(appendDev('Extract reddit image/video from URL.'))
		.addStringOption((option: SlashCommandStringOption) =>
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
			const post = await this.fetchPost(this.parseURL(option.post));

			const mediaURL = post.secure_media?.reddit_video?.fallback_url ?? post.url;

			const embed = new EmbedBuilder() //
				.setTitle(post.title.length > 256 ? `${post.title.substring(0, 256)}...` : post.title)
				.setImage(mediaURL)
				.setURL(`https://reddit.com${post.permalink}`)
				.setDescription(`[Click for media link](${mediaURL})\n${post.selftext}`);
			return interaction.reply({ embeds: [embed.toJSON()] });
		} catch (e) {
			container.logger.error('Error while trying to fetch post: ', e);
			return interaction.reply({ content: "An error occurred while trying to fetch the post. Please recheck the URL if it's correct." });
		}
	}

	private async fetchPost(url: string) {
		const response = await fetch<RedditResponse[]>(url, FetchResultTypes.JSON);
		return response[0].data.children[0].data;
	}

	private parseURL(url: string) {
		url = url.includes('?') ? url.substring(0, url.indexOf('?')) : url;
		url = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
		return `${url}.json`;
	}
}

interface Option {
	post: string;
}

interface RedditResponse {
	data: {
		children: {
			data: {
				title: string;
				permalink: string;
				url: string;
				selftext: string;
				secure_media: {
					reddit_video: {
						fallback_url: string;
					};
				};
			};
		}[];
	};
}
