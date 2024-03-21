import * as React from 'react';
import {AuthenticatedContextProvider} from './hooks/useAuthenticatedContext';
// import {PlayersContextProvider} from './hooks/usePlayers';

import {VoiceChannelActivity} from './components/InfiniteCraftActivity';
export default function App() {
  return (
    <AuthenticatedContextProvider>
        <VoiceChannelActivity />
    </AuthenticatedContextProvider>
  );
}


{/* <AuthenticatedContextProvider>
// <PlayersContextProvider>
   <VoiceChannelActivity />
// </PlayersContextProvider>
</AuthenticatedContextProvider> */}