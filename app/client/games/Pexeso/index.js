import { D, Block } from 'dwayne';
import template from './index.pug';
import { games as gamesConfig } from '../../../config/constants.json';

const {
  pexeso: {
    events: {
      game: {
        TURN_CARD,
        CARDS_LOADED
      }
    }
  }
} = gamesConfig;

class Pexeso extends Block {
  static template = template();

  backImage = '/public/images/pexeso/backs/default/0.jpg';

  constructor(opts) {
    super(opts);

    const gameData = this.args.gameData;
    const emitter = this.args.emitter;

    this.socket = this.args.socket;
    this.loaded = 0;
    this.options = gameData.options;
    this.setup();

    emitter.on(TURN_CARD, this.onTurnCard);
  }

  afterConstruct() {
    this.watchArgs('gameData', this.setup);
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
    this.turn = gameData.turn;
    this.currentTurnedCards = gameData.currentTurnedCards;
    this.match = gameData.match;
  };

  turnCard(x, y) {
    const card = this.field[y][x];

    if (!this.args.isMyTurn || !card.isInPlay || card.isTurned || this.currentTurnedCards.length >= 2) {
      return;
    }

    this.emit(TURN_CARD, { x, y });
  }

  changeCard(x, y, card) {
    const { field } = this;

    this.field = [
      ...field.slice(0, y),
      [
        ...field[y].slice(0, x),
        {
          ...field[y][x],
          ...card
        },
        ...field[y].slice(x + 1)
      ],
      ...field.slice(y + 1)
    ];
  }

  onTurnCard = ({ x, y, match }) => {
    this.currentTurnedCards.push({ x, y });
    this.match = match;
    this.changeCard(x, y, {
      opened: true
    });

    D(200)
      .timeout()
      .then(() => {
        this.changeCard(x, y, {
          isTurned: true,
          opened: false
        });
      });
  };

  onCardLoaded(card) {
    if (!card.isTurned) {
      return;
    }

    if (++this.loaded !== 2) {
      return;
    }

    const { currentTurnedCards } = this;

    this.emit(CARDS_LOADED);

    D(2000)
      .timeout()
      .then(() => {
        this.loaded = 0;
        this.currentTurnedCards = D([]);

        currentTurnedCards.forEach(({ x, y }) => {
          this.changeCard(
            x,
            y,
            this.match
              ? { isInPlay: false }
              : { opened: true }
          );
        });

        if (!this.match) {
          return D(200).timeout();
        }
      })
      .then(() => {
        if (this.match) {
          return;
        }

        currentTurnedCards.forEach(({ x, y }) => {
          this.changeCard(x, y, {
            isTurned: false,
            opened: false
          });
        });
      });
  }
}

Block.register('Pexeso', Pexeso);
