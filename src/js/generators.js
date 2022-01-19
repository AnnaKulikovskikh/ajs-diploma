/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Undead from './Undead';
import Vampire from './Vampire';
import Magician from './Magician';
import Daemon from './Daemon';

export function* characterGenerator(allowedTypes, maxLevel) {
  const Random = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  let type = '';
  if (Random === Swordsman) {
    type = 'swordsman';
  } else if (Random === Bowman) {
    type = 'bowman';
  } else if (Random === Magician) {
    type = 'magician';
  } else if (Random === Undead) {
    type = 'undead';
  } else if (Random === Daemon) {
    type = 'daemon';
  } else if (Random === Vampire) {
    type = 'vampire';
  }
  const level = Math.floor((Math.random() * maxLevel) + 1);
  yield new Random(level, type);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    const generator = characterGenerator(allowedTypes, maxLevel);
    team.push(generator.next().value);
  }
  return team;
}
