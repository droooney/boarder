import io from 'socket.io-client';
import { D, Block, makeRoute, router } from 'dwayne';
import template from './index.pug';
import { games as gamesConfig } from '../../../config/constants.json';

const {
  global: {
    events: {
      lobby: {
        GET_LIST,
        NEW_ROOM,
        UPDATE_ROOM,
        DELETE_ROOM
      }
    }
  }
} = gamesConfig;

class Lobby extends Block {
  static template = template();
  static routerOptions = {
    name: 'lobby',
    parent: 'games',
    path: '/:game(hexagon|pexeso)'
  };

  constructor(opts) {
    super(opts);

    this.reset();
  }

  reset() {
    this.rooms = [];
    this.gameName = '';
  }

  beforeLoadRoute() {
    const name = this.args.route.params.game;
    const nsp = gamesConfig[name].LOBBY_NSP;
    const socket = this.socket = io(nsp, {
      forceNew: true
    });

    this.gameName = name;

    socket.on(GET_LIST, this.onListReceived);
    socket.on(NEW_ROOM, this.onNewRoom);
    socket.on(UPDATE_ROOM, this.onUpdateRoom);
    socket.on(DELETE_ROOM, this.onDeleteRoom);
    socket.on('connect', () => {
      console.log('connected to lobby');
    });
    socket.on('error', (err) => {
      router.go('login');

      console.log(err);
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    setTimeout(() => {
      this.title.text(this.i18n.t(`games.${ name }_caption`));
    }, 0);
  }

  beforeLeaveRoute() {
    this.socket.disconnect();
    this.reset();
  }

  constructPlayLink(room) {
    return this.router.buildURL('room', {
      params: {
        roomId: room.id
      }
    });
  }

  constructObserveLink(room) {
    return this.router.buildURL('room', {
      params: {
        roomId: room.id
      },
      query: { observe: true }
    });
  }

  onCreateRoomClick = () => {
    this.socket.emit(NEW_ROOM);
  };

  onListReceived = (rooms) => {
    this.rooms = rooms;
  };

  onNewRoom = (room) => {
    const { rooms } = this;

    this.rooms = [
      ...rooms,
      room
    ];
  };

  onUpdateRoom = (room) => {
    const { rooms } = this;
    const foundRoom = D(rooms).find(({ id }) => id === room.id);

    if (foundRoom) {
      const { key } = foundRoom;

      this.rooms = [
        ...rooms.slice(0, key),
        room,
        ...rooms.slice(key + 1)
      ];
    }
  };

  onDeleteRoom = (id) => {
    const { rooms } = this;
    const foundRoom = D(rooms).find(({ id: ID }) => ID === id);

    if (foundRoom) {
      const { key } = foundRoom;

      this.rooms = [
        ...rooms.slice(0, key),
        ...rooms.slice(key + 1)
      ];
    }
  };
}

const wrap = Lobby
  .wrap(makeRoute());

Block.register('Lobby', wrap);
