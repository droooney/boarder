import { EGame } from 'common/types';
import { EPexesoSet } from 'common/types/pexeso';

export const GAMES_CONFIG = {
  games: {
    [EGame.PEXESO]: {
      name: EGame.PEXESO,
      minPlayersCount: 2,
      maxPlayersCount: 4,
      sets: {
        [EPexesoSet.COMMON]: {
          imagesCount: 33,
          imageVariantsCount: 1,
        },
        [EPexesoSet.FRIENDS]: {
          imagesCount: 30,
          imageVariantsCount: 1,
        },
        [EPexesoSet.GAME_OF_THRONES]: {
          imagesCount: 84,
          imageVariantsCount: 1,
        },
        [EPexesoSet.HARRY_POTTER]: {
          imagesCount: 30,
          imageVariantsCount: 1,
        },
        [EPexesoSet.LOST]: {
          imagesCount: 40,
          imageVariantsCount: 1,
        },
        [EPexesoSet.PHILADELPHIA]: {
          imagesCount: 30,
          imageVariantsCount: 1,
        },
        [EPexesoSet.PIRATES]: {
          imagesCount: 30,
          imageVariantsCount: 1,
        },
        [EPexesoSet.POKER]: {
          imagesCount: 30,
          imageVariantsCount: 1,
        },
        [EPexesoSet.STAR_WARS]: {
          imagesCount: 40,
          imageVariantsCount: 1,
        },
        [EPexesoSet.DST]: {
          imagesCount: 40,
          imageVariantsCount: 1,
        },
      },
      matchingCardsCounts: [2, 3, 4, 5, 6],
      differentCardsCounts: [4, 6, 8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 54, 60, 72, 84],
      fieldSizes: {
        8: { width: 4, height: 2 },
        12: { width: 4, height: 3 },
        16: { width: 4, height: 4 },
        18: { width: 6, height: 3 },
        20: { width: 5, height: 4 },
        24: { width: 6, height: 4 },
        30: { width: 6, height: 5 },
        32: { width: 8, height: 4 },
        36: { width: 6, height: 6 },
        40: { width: 8, height: 5 },
        48: { width: 8, height: 6 },
        50: { width: 10, height: 5 },
        60: { width: 10, height: 6 },
        64: { width: 8, height: 8 },
        72: { width: 9, height: 8 },
        80: { width: 10, height: 8 },
        96: { width: 12, height: 8 },
        100: { width: 10, height: 10 },
        108: { width: 12, height: 9 },
        120: { width: 12, height: 10 },
        144: { width: 16, height: 9 },
        160: { width: 16, height: 10 },
        162: { width: 18, height: 9 },
        168: { width: 14, height: 12 },
        180: { width: 18, height: 10 },
        192: { width: 16, height: 12 },
        200: { width: 20, height: 10 },
        216: { width: 18, height: 12 },
        240: { width: 20, height: 12 },
        252: { width: 21, height: 12 },
        270: { width: 18, height: 15 },
        288: { width: 18, height: 16 },
        300: { width: 20, height: 15 },
        324: { width: 18, height: 18 },
        336: { width: 24, height: 14 },
        360: { width: 24, height: 15 },
        420: { width: 28, height: 15 },
        // 432: { width: 24, height: 18 },
        432: { width: 27, height: 16 },
        504: { width: 28, height: 18 },
      } as Record<number, { width: number; height: number }>,
      defaultGameOptions: {
        set: EPexesoSet.COMMON,
        playersCount: 2,
        matchingCardsCount: 2,
        differentCardsCount: 30,
        pickRandomImages: false,
        useImageVariants: false,
      },
    },
    [EGame.SURVIVAL_ONLINE]: {
      name: EGame.SURVIVAL_ONLINE,
      minPlayersCount: 1,
      maxPlayersCount: 4,
      cellSize: 100,
      viewSize: {
        width: 21,
        height: 13,
      },
      fieldHeight: 12,
      defaultGameOptions: {
        playersCount: 2,
      },
    },
  },
};
