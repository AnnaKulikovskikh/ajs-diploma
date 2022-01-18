import Character from './Character';

export default class Daemon extends Character {
  constructor(...params) {
    super(...params);
    this.level = 1;
    this.type = 'daemon';
    this.attack = 10;
    this.defence = 40;
  }
}
