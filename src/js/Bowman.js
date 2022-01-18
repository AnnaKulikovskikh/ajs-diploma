import Character from './Character';

export default class Bowman extends Character {
  constructor(...params) {
    super(...params);
    this.level = 1;
    this.type = 'bowman';
    this.attack = 25;
    this.defence = 25;
  }
}
