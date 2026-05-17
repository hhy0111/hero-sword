import './style.css';
import { createGame } from './game/core/game';
import { runtimeConfig } from './config/runtime';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Missing #app root element.');
}

document.title = runtimeConfig.app.name;

createGame(root);
