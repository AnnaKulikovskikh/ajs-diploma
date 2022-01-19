import Character from './Character';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }

  static getPositions(team, access) {
    const positions = [];
    for (const pers of team) {
      const pos = access[Math.floor(Math.random() * access.length)];
      access.splice(access.indexOf(pos), 1);
      positions.push(new PositionedCharacter(pers, pos));
    }
    return positions;
  }
}
