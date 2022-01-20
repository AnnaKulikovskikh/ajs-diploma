import Character from '../Character';
import GamePlay from '../src/js/GamePlay';
import GameController from '../src/js/GameController';
import GameStateService from '../src/js/GameStateService';

test('Создание Bowman', () => {
  const expected = {
    level: 1,
    health: 50,
    type: 'bowman',
    attack: 25,
    defence: 25,
  };
  const received = new Character(1, 'Bowman');
  expect(received).toEqual(expected);
});

test('Создание Character', () => {
  expect(() => {
    new Character(1);
  }).toThrow();
});

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameContr = new GameController(gamePlay, stateService);

test('Наведение мыши на перса игрока', () => {
  gameContr.myPositions = [1];
  const expected = 'pointer';
  const received = gameContr.onCellEnter(1);
  expect(received).toEqual(expected);
});

test('Наведение мыши на перса компа для атаки', () => {
  gameContr.compPositions = [7];
  gameContr.possibleAttack = [5, 7, 13, 14, 15];
  const expected = 'crosshair';
  const received = gameContr.onCellEnter(7);
  expect(received).toEqual(expected);
});

test('Наведение мыши для перехода', () => {
  gameContr.myPositions = [0];
  gameContr.possibleMove = [1, 8, 9];
  const expected = 'pointer';
  const received = gameContr.onCellEnter(8);
  expect(received).toEqual(expected);
});

test('Недопустимое действие', () => {
  gameContr.myPositions = [0];
  gameContr.possibleMove = [1, 2, 8, 9, 10, 16, 17, 18];
  gameContr.possibleAttack = [1, 2, 8, 9, 10, 16, 17, 18];
  const expected = 'not-allowed';
  const received = gameContr.onCellEnterCursor(35);
  expect(received).toEqual(expected);
});
