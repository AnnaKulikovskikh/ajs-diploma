import themes from './themes';
import gamePlay from './GamePlay';
import {generateTeam, getTeamWithPosition} from './generators';
import PositionedCharacter from './PositionedCharacter';
import GameStateService from "./GameStateService";
import GameState from "./GameState";
import bowman from './Bowman';
import swordsman from './Swordsman';
import magician from './Magician';
import undead from './Undead';
import vampire from './Vampire';
import daemon from './Daemon';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.level = 1;
    this.charge = []; //массив занятых полей
    this.myPositions = []; //позиции игрока
    this.compPositions = []; //позиции компьютера
    this.chosen = -1; //индекс с выбранным персом
    this.select = -1;// индекс с другим выбранным полем
    this.possibleMove = []; //куда может пойти
    this.possibleAttack = []; //куда может атакавать
    this.turn = 1; // 1 - очередь игрока, 0 - очередь компютера
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    
    let theme = themes.prairie;
    if (this.level === 2) { theme = themes.desert; }
    if (this.level === 3) { theme = themes.arctic; }
    if (this.level === 4) { theme = themes.mountain; }
    this.gamePlay.drawUi(theme);

    const myTeam = generateTeam([bowman, swordsman], 1, 2);
    const compTeam = generateTeam([undead, vampire], 1, 2);
    
    let pos1 = PositionedCharacter.getPositions(myTeam, [0,1,8,9,16,17,24,25,32,33,40,41,48,49,56,57]);
    let pos2 = PositionedCharacter.getPositions(compTeam, [6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]);
    pos1.forEach(item => this.myPositions.push(item['position'])); //наполнение this.myPositions - позиции игрока
    pos2.forEach(item => this.compPositions.push(item['position'])); // наполнение this.compPositions - позиции компьюетра
    this.gamePlay.positions = pos1.concat(pos2);
    this.gamePlay.positions.forEach(item => this.charge.push(item['position'])); // наполнение this.charge - все занятые позиции

    this.gamePlay.redrawPositions(this.gamePlay.positions);

    //события
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      this.gamePlay.cells[i].addEventListener('mouseenter', () => this.onCellEnter(i)); // Вызов реакции на наведение мыши
      this.gamePlay.cells[i].addEventListener('click', () => this.onCellClick(i));// Вызов реакции на клик
      this.gamePlay.cells[i].addEventListener('mouseleave', () => this.onCellLeave(i));// Вызов реакции на вывод мыши
    }

    this.gamePlay.addNewGameListener(()=> this.newGame())
    this.gamePlay.addSaveGameListener(() => this.saveGame())
    this.gamePlay.addLoadGameListener(() => this.loadGame())
  }

  onCellClick(index) {
    // TODO: react to click
    //const cell = this.gamePlay.cells[index];
    
    // Выделение перса
    if (this.myPositions.includes(index)) {
      if (this.chosen !== -1) { //убираем выделение доугого перса. если оно есть
        this.gamePlay.deselectCell(this.chosen);
      }
      this.gamePlay.selectCell(index); 
      this.chosen = index;
    }

    // Определение типа выбранного перса
    let pers = '';
    this.gamePlay.positions.forEach(item => {
      if (item.position === index) { 
        if (item.character.type === 'swordsman' || item.character.type === 'bowman' || item.character.type === 'magician') {
          pers = item.character.type ;
        }   
      } 
    })
    
    //куда перс может пойти или атаковать
    this.moveAttack(pers, index); //заполняет массивы this.possibleMove и this.possibleAttack

    if (this.chosen != -1) {
      //передвижение
      if (this.possibleMove.includes(index) && !this.charge.includes(index)) {
        this.gamePlay.positions.forEach(item => {
          if (item.position === this.chosen) { 
            item.position = index;
            this.myPositions.splice(this.myPositions.indexOf(this.chosen), 1);
            this.myPositions.push(index);
            this.charge.splice(this.charge.indexOf(this.chosen), 1);
            this.charge.push(index);
          } 
        })
        this.gamePlay.redrawPositions(this.gamePlay.positions);
        this.gamePlay.deselectCell(this.chosen);
        this.chosen = -1;
        this.turn = 0;
        this.compAction();
      } //конец передвижение

      //атака
      if (this.possibleAttack.includes(index) && this.compPositions.includes(index)) {
        // let attacker = -1; //позиции атакующего и защищающегося
        // let defender = -1;
        // for (let i = 0 ; i < this.gamePlay.positions.length; i ++) {
        //   if (this.gamePlay.positions[i].position === this.chosen) { attacker = i};
        //   if (this.gamePlay.positions[i].position === index) { defender = i};
        // }
        // this.attack(attacker, defender);

        this.attack(this.chosen, index);
        this.gamePlay.deselectCell(this.chosen);
        this.chosen = -1;
        this.turn = 0;
        this.compAction();
      }  //конец атака
    }

  } // onCellClick

  onCellEnter(index) {
    // TODO: react to mouse enter
    //инфо о перса
    const cell = this.gamePlay.cells[index];
    if (this.charge.includes(index)) this.getTooltip(index);

    if (this.chosen != -1) {
      //передвижение
      if (this.possibleMove.includes(index) && !this.charge.includes(index)) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
        this.select = index;
      }

      // недопустимое действие
      if (!this.possibleMove.includes(index) || this.compPositions.includes(index) && this.possibleMove.includes(index) && !this.possibleAttack.includes(index)) {
        this.gamePlay.setCursor('not-allowed');
      }

      //атака
      if (this.possibleAttack.includes(index) && this.compPositions.includes(index)) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
        this.select = index;
      }
    }
    
  } // конец onCellEnter

  onCellLeave(index) {
    // TODO: react to mouse leave
    //if (this.selected != index) {this.gamePlay.deselectCell(index)}
    this.gamePlay.setCursor('auto');
    if (this.select !== -1) { this.gamePlay.deselectCell(this.select) };
  }

  attack(attackInd, defendInd) {
    let attacker = -1; //позиции атакующего и защищающегося
    let defender = -1;
    for (let i = 0 ; i < this.gamePlay.positions.length; i ++) {
      if (this.gamePlay.positions[i].position === attackInd) { attacker = i};
      if (this.gamePlay.positions[i].position === defendInd) { defender = i};
    }

    let damage = Math.max(this.gamePlay.positions[attacker].character.attack - this.gamePlay.positions[defender].character.defence, this.gamePlay.positions[attacker].character.attack * 0.1);
    this.gamePlay.positions[defender].character.health -= damage;
    if (this.gamePlay.positions[defender].character.health < 0 ) {
      let arr = [];
      if (this.turn === 1) { arr = this.compPositions} else { arr = this.myPositions};
      for (let i = 0; i < arr.length; i ++) {
        if (arr[i] === this.gamePlay.positions[defender].position) {
          if (this.turn === 1) { this.compPositions.splice(i, 1) } else { this.myPositions.splice(i, 1)}
        }
      }
      this.gamePlay.positions.splice(defender, 1);
      //удалить defender из this.charge
    } 
    this.gamePlay.redrawPositions(this.gamePlay.positions);
  }

  //куда выбранный перс может ходить и атаковать
  moveAttack (pers, index) {
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

  //рассчет возможных полей для хода или атаки
  farCounter(pos, n) {
    let set1 = new Set();
    
    for (let i = 0; i < n + 1; i++) {
      for (let j = 0; j < n + 1; j++) {
        if (pos - 8 * i >= 0 && pos % 8 - j >= 0) { set1.add(pos - 8 *  i - j) };
        if (pos - 8 * i >= 0 && pos % 8 + j < 8) { set1.add(pos - 8 *  i + j) };
        if (pos % 8 - j >= 0 && pos + 8 * i < 64) { set1.add(pos + 8 *  i - j) };
        if (pos + 8 * i < 64 && pos % 8 + j < 8) { set1.add(pos + 8 *  i + j) };
      }
    }
    return [...set1].sort((a, b) => a - b);
  }

  compAction () {
    //случайный выбор персонажа
    let compPers = '';
    const pos = this.compPositions[Math.floor(Math.random() * this.compPositions.length)];
    this.gamePlay.positions.forEach(item => {
      if (item.position === pos) { 
          compPers = item.character.type ;
      }  
    })

    //куда может идти и атаковать
    this.moveAttack(compPers, pos);
  
    //проверить возможна ли атака
    let attackIndex = -1;
    for (let i of this.myPositions) {
      if (this.possibleAttack.includes(i)) { attackIndex = i}
    }

    if (attackIndex != -1) {
      this.attack(pos, attackIndex);
    }
    //если да - атаковать

    //console.log(this.possibleMove);
    //console.log(attackIndex);
    this.turn = 1;
  }// конец compAction

  getTooltip(index) {

    const cell = this.gamePlay.cells[index];
    const char = this.gamePlay.positions;
    
    for (const position in char) {
      if (index === char[position]['position']) {
        const types = char[position].character.type;
        if ((GameState.selected !== cell) && (types === 'bowman' || types === 'swordsman' || types === 'magician')) {
          this.gamePlay.setCursor('pointer');
        }
        const unicodesPic = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map((code) => String.fromCodePoint(code));
        const [level, attack, defense, health] = unicodesPic;
        const message = `${level} ${char[position].character.level} ${attack} ${char[position].character.attack} ${defense} ${char[position].character.defence} ${health}  ${char[position].character.health}`
        this.gamePlay.showCellTooltip(message, index)
        if(!cell.querySelectorAll(".toolTip").length > 0) {
          this.gamePlay.addToolTip(cell) //else найти все остальные tollTip и убрать
        }
      }
    }
  }
}
