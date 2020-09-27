import React, { useCallback, useMemo, useState } from 'react';

import { GAMES_CONFIG } from 'common/constants/gamesConfig';

import { EGame } from 'common/types';
import { ISurvivalOnlineGameOptions, ISurvivalOnlinePlayer } from 'common/types/survivalOnline';

import Lobby from 'client/components/Lobby/Lobby';
import SurvivalOnlineGameOptions
  from 'client/pages/games/survivalOnline/SurvivalOnlineLobby/components/SurvivalOnlineGameOptions';

import useLobby from 'client/hooks/useLobby';

const {
  games: {
    [EGame.SURVIVAL_ONLINE]: {
      defaultGameOptions,
    },
  },
} = GAMES_CONFIG;

const SurvivalOnlineLobby: React.FC = () => {
  const [options, setOptions] = useState<ISurvivalOnlineGameOptions>(defaultGameOptions);

  const {
    lobby,
    createRoom,
    enterRoom,
  } = useLobby<ISurvivalOnlineGameOptions, ISurvivalOnlinePlayer>(EGame.SURVIVAL_ONLINE, options);

  const optionsBlock = useMemo(() => {
    return (
      <SurvivalOnlineGameOptions
        options={options}
        onOptionsChange={setOptions}
      />
    );
  }, [options]);

  const renderRoomOptions = useCallback(() => {
    return null;
  }, []);

  if (!lobby) {
    return null;
  }

  return (
    <Lobby
      game={EGame.SURVIVAL_ONLINE}
      rooms={lobby.rooms}
      options={optionsBlock}
      renderRoomOptions={renderRoomOptions}
      onEnterRoom={enterRoom}
      onCreateRoom={createRoom}
    />
  );
};

export default React.memo(SurvivalOnlineLobby);
