import Character from './Character';

export default class Swordsman extends Character {
  constructor(...params) {
    super(...params);
    this.level = 1;
    this.type = 'swordsman';
    this.attack = 40;
    this.defence = 10;
  }
}
