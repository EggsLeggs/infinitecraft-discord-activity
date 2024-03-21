import * as React from 'react';

import {discordSdk} from '../discordSdk';
import {LoadingScreen} from '../components/LoadingScreen';
import {getUserAvatarUrl} from '../utils/getUserAvatarUrl';

import type {IGuildsMembersRead} from '../types';
import {getUserDisplayName} from '../utils/getUserDisplayName';

const AuthenticatedContext = React.createContext<any>({
  user: {
    id: '',
    username: '',
    discriminator: '',
    avatar: null,
    public_flags: 0,
  },
  access_token: '',
  scopes: [],
  expires: '',
  application: {
    rpc_origins: undefined,
    id: '',
    name: '',
    icon: null,
    description: '',
  },
  // guildMember: null,
});

export function AuthenticatedContextProvider({children}: {children: React.ReactNode}) {
  const authenticatedContext = useAuthenticatedContextSetup();

  // if (authenticatedContext == null) {
  //   return <LoadingScreen />;
  // }

  return <AuthenticatedContext.Provider value={authenticatedContext}>{children}</AuthenticatedContext.Provider>;
}

export function useAuthenticatedContext() {
  return React.useContext(AuthenticatedContext);
}

/**
 * This is a helper hook which is used to connect your embedded app with Discord
 */
function useAuthenticatedContextSetup() {
  const [auth, setAuth] = React.useState<any | null>(null);
  const settingUp = React.useRef(false);

  React.useEffect(() => {
    const setUpDiscordSdk = async () => {
      console.log('pre-ready test')
      console.log(import.meta.env.VITE_DISCORD_CLIENT_ID)
      await discordSdk.ready();
      console.log('post-ready test')
      console.log(import.meta.env.VITE_DISCORD_CLIENT_ID)
      // Authorize with Discord Client
      const {code} = await discordSdk.commands.authorize({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        response_type: 'code',
        state: '',
        prompt: 'none',
        // More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
        scope: [
          // "applications.builds.upload",
          // "applications.builds.read",
          // "applications.store.update",
          // "applications.entitlements",
          // "bot",
          'identify',
          // "connections",
          // "email",
          // "gdm.join",
          'guilds',
          // "guilds.join",
          // 'guilds.members.read',
          // "messages.read",
          // "relationships.read",
          // 'rpc.activities.write',
          // "rpc.notifications.read",
          // "rpc.voice.write",
          // 'rpc.voice.read',
          // "webhook.incoming",
        ],
      });

      // Retrieve an access_token from your embedded app's server
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      });
      const {access_token} = await response.json();

      // Authenticate with Discord client (using the access_token)
      const newAuth: any = await discordSdk.commands.authenticate({
        access_token,
      });

      // // Get guild specific nickname and avatar, and fallback to user name and avatar
      // const guildMember: IGuildsMembersRead | null = await fetch(
      //   `/discord/api/users/@me/guilds/${discordSdk.guildId}/member`,
      //   {
      //     method: 'get',
      //     headers: {Authorization: `Bearer ${access_token}`},
      //   }
      // )
      //   .then((j) => j.json())
      //   .catch(() => {
      //     return null;
      //   });

      // // Done with discord-specific setup

      // // Get the user's guild-specific avatar uri
      // // If none, fall back to the user profile avatar
      // // If no main avatar, use a default avatar
      // const avatarUri = getUserAvatarUrl({
      //   guildMember,
      //   user: newAuth.user,
      // });

      // // Get the user's guild nickname. If none set, fall back to global_name, or username
      // // Note - this name is note guaranteed to be unique
      // const name = getUserDisplayName({
      //   guildMember,
      //   user: newAuth.user,
      // });

      // // Finally, we construct our authenticatedContext object to be consumed throughout the app
      // setAuth({...newAuth, guildMember});
      setAuth({...newAuth});
    };

    if (!settingUp.current) {
      settingUp.current = true;
      setUpDiscordSdk();
    }
  }, []);

  return auth;
}
