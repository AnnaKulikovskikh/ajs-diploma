import themes from './themes';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import bowman from './Bowman';
import swordsman from './Swordsman';
import magician from './Magician';
import undead from './Undead';
import vampire from './Vampire';
import daemon from './Daemon';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.level = 1;
    this.charge = []; // массив занятых полей
    this.myPositions = []; // позиции игрока
    this.compPositions = []; // позиции компьютера
    this.chosen = -1; // индекс с выбранным персом
    this.select = -1;// индекс с другим выбранным полем
    this.possibleMove = []; // куда может пойти
    this.possibleAttack = []; // куда может атакавать
    this.turn = 1; // 1 - очередь игрока, 0 - очередь компютера
    this.score = 0; // очки за уровень
    this.myTeam = [];
    this.compTeam = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    let theme = themes.prairie;
    if (this.level === 1) {
      this.myTeam = generateTeam([bowman, swordsman], 1, 2);
      this.compTeam = generateTeam([undead, vampire], 1, 2);
    }

    if (this.level === 2) {
      theme = themes.desert;
      this.myTeam = generateTeam([bowman, swordsman, magician], 1, 1);
      this.gamePlay.positions.forEach((item) => {
        this.myTeam.push(item.character);
      });
      this.compTeam = generateTeam([undead, vampire, daemon], 2, this.myTeam.length);
    }

    if (this.level === 3) {
      theme = themes.arctic;
      this.myTeam = generateTeam([bowman, swordsman, magician], 2, 2);
      this.gamePlay.positions.forEach((item) => {
        this.myTeam.push(item.character);
      });
      this.compTeam = generateTeam([undead, vampire, daemon], 3, this.myTeam.length);
    }

    if (this.level === 4) {
      theme = themes.mountain;
      this.myTeam = generateTeam([bowman, swordsman, magician], 3, 2);
      this.gamePlay.positions.forEach((item) => {
        this.myTeam.push(item.character);
      });
      this.compTeam = generateTeam([undead, vampire, daemon], 4, this.myTeam.length);
    }

    this.gamePlay.drawUi(theme);
    const arr1 = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const pos1 = PositionedCharacter.getPositions(this.myTeam, arr1);
    const arr0 = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    const pos2 = PositionedCharacter.getPositions(this.compTeam, arr0);
    pos1.forEach((item) => this.myPositions.push(item.position)); // myPositions -поз игрока
    pos2.forEach((item) => this.compPositions.push(item.position)); // compPositions -поз компа
    this.gamePlay.positions = pos1.concat(pos2);
    this.gamePlay.positions.forEach((item) => this.charge.push(item.position));
    this.myTeam = [];
    this.compTeam = [];
    this.gamePlay.redrawPositions(this.gamePlay.positions);

    // события
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      this.gamePlay.cells[i].addEventListener('mouseenter', () => this.onCellEnter(i)); // Вызов реакции на наведение мыши
      this.gamePlay.cells[i].addEventListener('click', () => this.onCellClick(i));// Вызов реакции на клик
      this.gamePlay.cells[i].addEventListener('mouseleave', () => this.onCellLeave(i));// Вызов реакции на вывод мыши
    }

    this.gamePlay.newGameEl.addEventListener('click', () => this.newGame());
    this.gamePlay.saveGameEl.addEventListener('click', () => this.saveGame());
    this.gamePlay.loadGameEl.addEventListener('click', () => this.loadGame());
  }

  newGame() {
    this.level = 1;
    this.charge = [];
    this.myPositions = [];
    this.compPositions = [];
    this.chosen = -1;
    this.select = -1;
    this.possibleMove = [];
    this.possibleAttack = [];
    this.turn = 1;
    this.score = 0;
    this.init();
  }

  saveGame() {
    const state = {
      positions: this.gamePlay.positions,
      level: this.level,
      charge: this.charge,
      myPositions: this.myPositions,
      compPositions: this.compPositions,
      chosen: this.chosen,
      select: this.select,
      possibleMove: this.possibleMove,
      possibleAttack: this.possibleAttack,
      turn: this.turn,
      score: this.score,
    };
    this.stateService.save(GameState.from(state));
  }

  loadGame() {
    const load = this.stateService.load();
    this.gamePlay.positions = load.positions;
    this.level = load.level;
    this.charge = load.charge;
    this.myPositions = load.myPositions;
    this.compPositions = load.compPositions;
    this.chosen = load.chosen;
    this.select = load.select;
    this.possibleMove = load.possibleMove;
    this.possibleAttack = load.possibleAttack;
    this.turn = load.turn;
    this.score = load.score;
    let theme = themes.prairie;
    if (this.level === 2) { theme = themes.desert; }
    if (this.level === 3) { theme = themes.arctic; }
    if (this.level === 4) { theme = themes.mountain; }
    this.gamePlay.drawUi(theme);
    this.gamePlay.redrawPositions(this.gamePlay.positions);
    // if (this.turn === 0) { this.compAction; }
  }

  onCellClick(index) {
    // TODO: react to click

    // Выделение перса
    if (this.myPositions.includes(index)) {
      if (this.chosen !== -1) { // убираем выделение доугого перса. если оно есть
        this.gamePlay.deselectCell(this.chosen);
      }
      this.gamePlay.selectCell(index);
      this.chosen = index;
    }

    // Определение типа выбранного перса
    let pers = '';
    this.gamePlay.positions.forEach((item) => {
      if (item.position === index) {
        if (item.character.type === 'swordsman' || item.character.type === 'bowman' || item.character.type === 'magician') {
          pers = item.character.type;
        }
      }
    });

    // куда перс может пойти или атаковать
    this.moveAttack(pers, index); // заполняет массивы this.possibleMove и this.possibleAttack

    if (this.chosen !== -1) {
      // передвижение
      if (this.possibleMove.includes(index) && !this.charge.includes(index)) {
        this.move(this.chosen, index);
        this.myPositions.splice(this.myPositions.indexOf(this.chosen), 1);
        this.myPositions.push(index);
        this.gamePlay.redrawPositions(this.gamePlay.positions);
        this.gamePlay.deselectCell(this.chosen);
        this.chosen = -1;
        this.turn = 0;
        this.compAction();
      } // конец передвижение

      // атака
      if (this.possibleAttack.includes(index) && this.compPositions.includes(index)) {
        this.attack(this.chosen, index);
        this.gamePlay.deselectCell(this.chosen);
        this.chosen = -1;
        this.turn = 0;
        this.compAction();
      } // конец атака
    }
  } // onCellClick

  onCellEnter(index) {
    // TODO: react to mouse enter
    // инфо о перса

    if (this.charge.includes(index)) this.getTooltip(index);

    if (this.chosen !== -1) {
      // передвижение
      if (this.possibleMove.includes(index) && !this.charge.includes(index)) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
        this.select = index;
      }

      // недопустимое действие
      const enFar1 = this.compPositions.includes(index) && this.possibleMove.includes(index);
      const enFar = enFar1 && !this.possibleAttack.includes(index);
      if (!this.possibleMove.includes(index) || enFar) {
        this.gamePlay.setCursor('not-allowed');
      }

      // атака
      if (this.possibleAttack.includes(index) && this.compPositions.includes(index)) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
        this.select = index;
      }
    }
  } // конец onCellEnter

  onCellLeave() {
    // TODO: react to mouse leave
    // if (this.selected != index) {this.gamePlay.deselectCell(index)}
    this.gamePlay.setCursor('auto');
    if (this.select !== -1) { this.gamePlay.deselectCell(this.select); }
  }

  levelUp() {
    this.level += 1;
    this.gamePlay.positions.forEach((item) => {
      item.character.level += 1;
      const attack = item.character.attack * (1.8 - 0.01 * item.character.health);
      item.character.attack = Math.max(item.character.attack, attack);
      const defence = item.character.defence * (1.8 - 0.01 * item.character.health);
      item.character.defence = Math.max(item.character.defence, defence);
      const health = item.character.health + 80;
      if (health <= 100) { item.character.health = health; } else { item.character.health = 100; }
    });

    this.charge = [];
    this.myPositions = [];
    this.compPositions = [];
    this.chosen = -1;
    this.select = -1;
    this.possibleMove = [];
    this.possibleAttack = [];
    this.turn = 1;
    this.init();
  }

  attack(attackInd, defendInd) {
    let attacker = -1; // позиции атакующего и защищающегося
    let defender = -1;
    for (let i = 0; i < this.gamePlay.positions.length; i += 1) {
      if (this.gamePlay.positions[i].position === attackInd) { attacker = i; }
      if (this.gamePlay.positions[i].position === defendInd) { defender = i; }
    }

    const att = this.gamePlay.positions[attacker].character.attack;
    const def = this.gamePlay.positions[defender].character.defence;
    const damage = Math.max(att - def, att * 0.1);
    this.gamePlay.positions[defender].character.health -= damage;
    if (this.gamePlay.positions[defender].character.health <= 0) {
      let arr = [];
      if (this.turn === 1) { arr = this.compPositions; } else { arr = this.myPositions; }
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i] === this.gamePlay.positions[defender].position) {
          if (this.turn === 1) {
            this.compPositions.splice(i, 1);
          } else { this.myPositions.splice(i, 1); }
        }
      }
      this.gamePlay.positions.splice(defender, 1);
      this.charge.splice(this.charge.indexOf(defendInd), 1);
      const cell = this.gamePlay.cells[defendInd];
      if (cell.querySelector('.toolTip')) {
        this.gamePlay.deleteToolTip(cell);
      }
    }
    this.gamePlay.redrawPositions(this.gamePlay.positions);

    // победа/поражение
    if (this.myPositions.length === 0) {
      alert('Провал...');
    } else if (this.compPositions.length === 0) {
      this.gamePlay.positions.forEach((item) => {
        this.score += item.character.health;
      });
      if (this.level === 4) {
        alert('Победа!');
      } else {
        alert('LEVEL UP!');
        this.levelUp();
      }
    }
  }

  // идти (окуда, куда)
  move(pos, index) {
    this.gamePlay.positions.forEach((item) => {
      if (item.position === pos) {
        item.position = index;
      }
    });
    this.charge.splice(this.charge.indexOf(pos), 1);
    this.charge.push(index);
    const cell = this.gamePlay.cells[pos];
    if (cell.querySelector('.toolTip')) {
      this.gamePlay.deleteToolTip(cell);
    }
  }

  // куда выбранный перс может ходить и атаковать
  moveAttack(pers, index) {
    if (pers === 'swordsman' || pers === 'undead') {
      this.possibleMove = this.farCounter(index, 4);
      this.possibleAttack = this.farCounter(index, 1);
    }

    if (pers === 'bowman' || pers === 'vampire') {
      this.possibleMove = this.farCounter(index, 2);
      this.possibleAttack = this.farCounter(index, 2);
    }

    if (pers === 'magician' || pers === 'daemon') {
      this.possibleMove = this.farCounter(index, 1);
      this.possibleAttack = this.farCounter(index, 4);
    }
  }

  // рассчет возможных полей для хода или атаки
  farCounter(pos, n) {
    const set1 = new Set();

    for (let i = 0; i < n + 1; i += 1) {
      for (let j = 0; j < n + 1; j += 1) {
        if (pos - (8 * i) >= 0 && (pos % 8) - j >= 0) { set1.add(pos - (8 * i) - j); }
        if (pos - (8 * i) >= 0 && (pos % 8) + j < 8) { set1.add(pos - (8 * i) + j); }
        if ((pos % 8) - j >= 0 && pos + (8 * i) < 64) { set1.add(pos + (8 * i) - j); }
        if (pos + (8 * i) < 64 && (pos % 8) + j < 8) { set1.add(pos + (8 * i) + j); }
      }
    }
    return [...set1].sort((a, b) => a - b);
  }

  compAction() {
    // случайный выбор персонажа
    let compPers = '';
    const pos = this.compPositions[Math.floor(Math.random() * this.compPositions.length)];
    this.gamePlay.positions.forEach((item) => {
      if (item.position === pos) {
        compPers = item.character.type;
      }
    });

    // куда может идти и атаковать
    this.moveAttack(compPers, pos);
    for (const i of this.charge) {
      if (this.possibleMove.includes(i)) {
        this.possibleMove.splice(this.possibleMove.indexOf(i), 1);
      }
    }

    // проверить возможна ли атака
    let attackIndex = -1;
    for (const i of this.myPositions) {
      if (this.possibleAttack.includes(i)) { attackIndex = i; }
    }

    // если да - атаковать
    if (attackIndex !== -1) {
      this.attack(pos, attackIndex);
    } else {
      const where = this.moveToGoal(pos);
      this.move(pos, where);
      this.compPositions.splice(this.compPositions.indexOf(pos), 1);
      this.compPositions.push(where);
      this.gamePlay.redrawPositions(this.gamePlay.positions);
    }
    this.turn = 1;
  }// конец compAction

  // движение перса компа к ближайшей цели
  moveToGoal(pos) {
    let goal = -1; // цель
    let goalMove = -1; // поле для передвижения
    let dist = 15; // измерение дистанции, вспомогательная переменная
    for (const i of this.myPositions) {
      if (dist > this.distance(pos, i)) {
        dist = this.distance(pos, i);
        goal = i;
      }
    }
    dist = 15;
    for (const i of this.possibleMove) {
      if (dist > Math.abs(goal - i)) {
        dist = Math.abs(goal - i);
        goalMove = i;
      }
    }
    return goalMove;
  }

  // расстояние между полями а и б
  distance(a, b) {
    const dist1 = Math.abs(Math.trunc(a / 8) - Math.trunc(b / 8));
    const dist2 = Math.abs((a % 8) - (b % 8));
    if (dist1 > dist2) return dist1;
    return dist2;
  }

  getTooltip(index) {
    const cell = this.gamePlay.cells[index];
    const char = this.gamePlay.positions;

    for (const position in char) {
      if (index === char[position].position) {
        const types = char[position].character.type;
        if ((GameState.selected !== cell) && (types === 'bowman' || types === 'swordsman' || types === 'magician')) {
          this.gamePlay.setCursor('pointer');
        }
        const unicodesPic = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map((code) => String.fromCodePoint(code));
        const [level, attack, defense, health] = unicodesPic;
        const message = `${level} ${char[position].character.level} ${attack} ${char[position].character.attack} ${defense} ${char[position].character.defence} ${health}  ${char[position].character.health}`;
        this.gamePlay.showCellTooltip(message, index);
        if (!cell.querySelectorAll('.toolTip').length > 0) {
          this.gamePlay.addToolTip(cell); // else найти все остальные tollTip и убрать
        }
      }
    }
  }
}
