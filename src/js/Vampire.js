import Character from './Character';

export default class Vampore extends Character {
  constructor(...params) {
    super(...params);
    this.level = 1;
    this.type = 'vampire';
    this.attack = 25;
    this.defence = 25;
  }
}
