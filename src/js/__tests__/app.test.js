import Bowman from '../Bowman';
import Character from '../Character';
import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

test('Создание Bowman', () => {
  const expected = {
    level: 1,
    health: 50,
    type: 'bowman',
    attack: 25,
    defence: 25,
  };
  const received = new Bowman();
  expect(received).toEqual(expected);
});

test('Создание Character', () => {
  expect(() => {
    new Character(1);
  }).toThrow();
});

// https://qastack.ru/programming/32911630/how-do-i-deal-with-localstorage-in-jest-tests
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

const localStorage = new LocalStorageMock();

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);

test('Вывод инфы о персе', () => {
  const bowman = {
    level: 1,
    health: 50,
    type: 'bowman',
    attack: 25,
    defence: 25,
    distance: 4,
    distanceAttack: 1,
  };
  const expected = '🎖1 ⚔ 25 🛡 25 ❤ 50';
  const received = gameCtrl.picture(bowman);
  expect(received).toEqual(expected);
});

test('Наведение мыши на перса игрока', () => {
  gameCtrl.myPositions = [1];
  gameCtrl.chosen = 1;
  const expected = 'pointer';
  const received = gameCtrl.onCellEnterCursor(1);
  expect(received).toEqual(expected);
});

test('Наведение мыши на перса компа для атаки', () => {
  gameCtrl.compPositions = [7];
  gameCtrl.possibleAttack = [5, 7, 13, 14, 15];
  const expected = 'crosshair';
  const received = gameCtrl.onCellEnterCursor(7);
  expect(received).toEqual(expected);
});

test('Наведение мыши для перехода', () => {
  gameCtrl.myPositions = [0];
  gameCtrl.possibleMove = [1, 8, 9];
  const expected = 'pointer';
  const received = gameCtrl.onCellEnterCursor(8);
  expect(received).toEqual(expected);
});

test('Недопустимое действие', () => {
  gameCtrl.myPositions = [0];
  gameCtrl.possibleMove = [1, 2, 8, 9, 10, 16, 17, 18];
  gameCtrl.possibleAttack = [1, 2, 8, 9, 10, 16, 17, 18];
  const expected = 'not-allowed';
  const received = gameCtrl.onCellEnterCursor(35);
  expect(received).toEqual(expected);
});
