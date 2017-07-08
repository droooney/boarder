const _ = require('lodash');
const {
  games: {
    survival_online: {
      limits: {
        densityForChunkToNotBeFrozen: DENSITY_FOR_NOT_TO_BE_FROZEN
      }
    }
  }

} = require('../../config/constants.json');

function deepMap(obj, f, ctx) {
  if (Array.isArray(obj)) {
    return obj.map(function(val, key) {
      return (typeof val === 'object') ? deepMap(val, f, ctx) : f.call(ctx, val, key, obj);
    });
  } else if (typeof obj === 'object') {
    const res = {};
    for (let key in obj) {
      const val = obj[key];
      if (typeof val === 'object') {
        res[key] = deepMap(val, f, ctx);
      } else {
        res[key] = f.call(ctx, val, key, obj);
      }
    }
    return res;
  } else {
    return obj;
  }
}

function setFrozenStatusToCloseChunks({ chunk: centerChunk, toFroze, actionSelf }) {
  const chunksToSet = [...centerChunk.closeChunks];

  if (actionSelf) {
    chunksToSet.push(centerChunk);
  }

  _.forEach(chunksToSet, (chunk) => {
    chunk.isFrozen = toFroze;

    if (!toFroze) {
      chunk.timestampLastSetUnfrozen = Date.now();
    }
  });
}

function countChunkDensity(chunk) {
  const {
    players,
    zombies
  } = chunk;

  return players.length*1000 + zombies.length*10;
}

function shouldChunkBeFrozen(centerChunk)  {
  let density = countChunkDensity(centerChunk);

  if (density >= DENSITY_FOR_NOT_TO_BE_FROZEN) return false;

  _.forEach(centerChunk.closeChunks, (chunk) => {
    density+= countChunkDensity(chunk) * 0.8;

    if (density >= DENSITY_FOR_NOT_TO_BE_FROZEN) return false;
  });

  return density < DENSITY_FOR_NOT_TO_BE_FROZEN;
}

function unfreezeChunkIfNeeded({ chunk, forceSet }) {
  if (forceSet || !shouldChunkBeFrozen(chunk)) {
    chunk.isFrozen = false;
    chunk.timestampLastSetUnfrozen = Date.now();
  }
}

exports.deepMap = deepMap;
exports.setFrozenStatusToCloseChunks = setFrozenStatusToCloseChunks;
exports.shouldChunkBeFrozen = shouldChunkBeFrozen;
exports.shouldChunkBeFrozen = shouldChunkBeFrozen;
exports.unfreezeChunkIfNeeded = unfreezeChunkIfNeeded;


