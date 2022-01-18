import Character from './Character';

export default class Magician extends Character {
  constructor(...params) {
    super(...params);
    this.level = 1;
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
  }
}
