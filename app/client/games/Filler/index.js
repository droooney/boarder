import _ from 'lodash';
import { Block } from 'dwayne';
import template from './index.pug';
import { getNeighbourCells } from '../../../shared/filler';
import { games as gamesConfig } from '../../../config/constants.json';

const {
  filler: {
    events: {
      game: {
        CHOOSE_COLOR
      }
    },
    colors
  }
} = gamesConfig;

class FillerGame extends Block {
  static template = template();

  CELL_SIZE = 24;
  BORDER_WIDTH = 2;
  colors = colors;

  constructor(opts) {
    super(opts);

    const {
      gameData,
      emitter,
      socket
    } = this.args;

    this.socket = socket;
    this.isTopLeft = gameData.players[0].login === this.globals.user.login;

    emitter.on(CHOOSE_COLOR, this.onChooseColor);
  }

  afterConstruct() {
    this.watch('args.gameData', this.setup);
  }

  emit() {
    this.socket.emit(...arguments);
  }

  setup = () => {
    const { gameData } = this.args;

    if (!gameData) {
      return;
    }

    this.field = gameData.field;
    this.currentColors = gameData.currentColors;
    this.playersCells = _(this.args.players)
      .map(({ data: { mainCell }, login }) => [
        login,
        _.concat([mainCell], getNeighbourCells(this.field, mainCell.color, [mainCell]))
      ])
      .fromPairs()
      .value();
  };

  changeCells(cells, color) {
    const { field } = this;

    _.forEach(cells, (cell) => {
      field[cell.y][cell.x] = {
        ...field[cell.y][cell.x],
        color
      };
    });

    this.field = _.map(field, (row) => _.map(row));
  }

  chooseColor(color) {
    if (!this.args.isMyTurn || !colors[color] || _.includes(this.currentColors, color)) {
      return;
    }

    this.emit(CHOOSE_COLOR, color);
  }

  onChooseColor = ({ currentColors, color, player }) => {
    const playerCells = this.playersCells[player.login];
    const neighbours = getNeighbourCells(this.field, color, playerCells);

    this.currentColors = currentColors;

    this.changeCells(playerCells, color);
    playerCells.push(...neighbours);
  };
}

Block.block('FillerGame', FillerGame);
