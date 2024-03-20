import {DiscordSDK, DiscordSDKMock} from '@discord/embedded-app-sdk';

const queryParams = new URLSearchParams(window.location.search);
const isEmbedded = queryParams.get('frame_id') != null;

let discordSdk: DiscordSDK | DiscordSDKMock;

if (isEmbedded) {
  discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
} else {
  throw new Error('This app is meant to be embedded in Discord');
}

export {discordSdk};
