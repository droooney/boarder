import io from 'socket.io-client';
import { D, find, doc, Elem } from 'dwayne';
import {
  LIVERELOAD_NSP,
  ASSETS_PATH
} from '../../config/constants.json';

const livereload = find('#livereload')
  .addClass('loaded');

const ready = doc
  .img('.image')
  .ref(`${ ASSETS_PATH }/images/checkmark.png`);
const loading = doc
  .img('.image')
  .ref(`${ ASSETS_PATH }/images/loading.gif`);

new Elem([ready, loading])
  .load()
  .then(() => {
    livereload.child(ready);
  });

const socket = io(LIVERELOAD_NSP);

window.D = D;

socket.on('connect', () => {
  console.log('%c%s', colored('green'), 'livereload enabled');
});

socket.on('tokill', () => {
  toreload();

  socket.emit('tokill-event');
});

socket.on('toreload', toreload);

socket.on('reload', () => {
  console.log('%c%s', colored('red'), 'reloading...');

  location.reload();
});

socket.on('css-updated', () => {
  find('#all-css').attr('href', `${ ASSETS_PATH }/css/all.css?${ Date.now() }`);

  unreload();
});

function colored(color) {
  return `color: ${ color }; font-weight: 900; font-size: 16px;`;
}

function toreload() {
  console.log('%c%s', colored('orange'), 'something changed...');

  livereload
    .addClass('reloading');

  ready.replace(loading);
}

function unreload() {
  console.log('%c%s', colored('green'), 'updated');

  livereload
    .removeClass('reloading');

  loading.replace(ready);
}
