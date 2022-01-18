import Character from './Character';

export default class Undead extends Character {
  constructor(...params) {
    super(...params);
    this.level = 1;
    this.type = 'undead';
    this.attack = 40;
    this.defence = 10;
  }
}
