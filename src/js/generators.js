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
  const random = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  let type = ''
  if (random === Swordsman) {
    type = 'swordsman'
  } else if (random === Bowman) {
    type = 'bowman'
  } else if (random === Magician) {
    type = 'magician'
  } else if (random === Undead) {
    type = 'undead'
  } else if (random === Daemon) {
    type = 'daemon'
  } else if (random === Vampire) {
    type = 'vampire'
  }
  let level = Math.floor((Math.random() * maxLevel) + 1)
  yield new random(level, type);

}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let team = [];
  for (let i = 0; i < characterCount; i++) {
    let generator = characterGenerator(allowedTypes, maxLevel)
    team.push(generator.next().value)
  }
  return team;
}
