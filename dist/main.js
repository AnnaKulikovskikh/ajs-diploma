(() => {
  const t = 'prairie'; const e = 'desert'; const s = 'arctic'; const i = 'mountain'; class a {constructor(t, e = 'generic') { if (this.level = t, this.attack = 0, this.defence = 0, this.health = 50, this.type = e, new.target === a) throw new Error('Низзя!'); }} class o extends a {constructor(...t) { super(...t), this.level = 1, this.type = 'bowman', this.attack = 25, this.defence = 25; }} class l extends a {constructor(...t) { super(...t), this.level = 1, this.type = 'swordsman', this.attack = 40, this.defence = 10; }} class h extends a {constructor(...t) { super(...t), this.level = 1, this.type = 'undead', this.attack = 40, this.defence = 10; }} class n extends a {constructor(...t) { super(...t), this.level = 1, this.type = 'vampire', this.attack = 25, this.defence = 25; }} class c extends a {constructor(...t) { super(...t), this.level = 1, this.type = 'magician', this.attack = 10, this.defence = 40; }} class r extends a {constructor(...t) { super(...t), this.level = 1, this.type = 'daemon', this.attack = 10, this.defence = 40; }} function* m(t, e) { const s = t[Math.floor(Math.random() * t.length)]; let i = ''; s === l ? i = 'swordsman' : s === o ? i = 'bowman' : s === c ? i = 'magician' : s === h ? i = 'undead' : s === r ? i = 'daemon' : s === n && (i = 'vampire'); const a = Math.floor(Math.random() * e + 1); yield new s(a, i); } function d(t, e, s) { const i = []; for (let a = 0; a < s; a += 1) { const s = m(t, e); i.push(s.next().value); } return i; } class p {
    constructor(t, e) { if (!(t instanceof a)) throw new Error('character must be instance of Character or its children'); if (typeof e !== 'number') throw new Error('position must be a number'); this.character = t, this.position = e; }

    static getPositions(t, e) { const s = []; for (const i of t) { const t = e[Math.floor(Math.random() * e.length)]; e.splice(e.indexOf(t), 1), s.push(new p(i, t)); } return s; }
  } class u {static from(t) { return t.chars = u.chars, t.turn = u.turn, t.selected = u.selected, t.score = u.score, t.theme = u.theme, t; }} const v = new class {
    constructor() { this.boardSize = 8, this.container = null, this.boardEl = null, this.cells = [], this.cellClickListeners = [], this.cellEnterListeners = [], this.cellLeaveListeners = [], this.newGameListeners = [], this.saveGameListeners = [], this.loadGameListeners = []; }

    bindToDOM(t) { if (!(t instanceof HTMLElement)) throw new Error('container is not HTMLElement'); this.container = t; }

    drawUi(t) { this.checkBinding(), this.container.innerHTML = '\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ', this.newGameEl = this.container.querySelector('[data-id=action-restart]'), this.saveGameEl = this.container.querySelector('[data-id=action-save]'), this.loadGameEl = this.container.querySelector('[data-id=action-load]'), this.newGameEl.addEventListener('click', ((t) => this.onNewGameClick(t))), this.saveGameEl.addEventListener('click', ((t) => this.onSaveGameClick(t))), this.loadGameEl.addEventListener('click', ((t) => this.onLoadGameClick(t))), this.boardEl = this.container.querySelector('[data-id=board]'), this.boardEl.classList.add(t); for (let t = 0; t < this.boardSize ** 2; t += 1) { const i = document.createElement('div'); i.classList.add('cell', 'map-tile', `map-tile-${e = t, s = this.boardSize, e === 0 ? 'top-left' : e === s - 1 ? 'top-right' : e === s ** 2 - 1 ? 'bottom-right' : e === s ** 2 - s ? 'bottom-left' : e > 0 && e < s - 1 ? 'top' : e > s ** 2 - s && e < s ** 2 ? 'bottom' : e % s == 0 ? 'left' : e % s == s - 1 ? 'right' : 'center'}`), i.addEventListener('mouseenter', ((t) => this.onCellEnter(t))), i.addEventListener('mouseleave', ((t) => this.onCellLeave(t))), i.addEventListener('click', ((t) => this.onCellClick(t))), this.boardEl.appendChild(i); } let e; let s; this.cells = Array.from(this.boardEl.children); }

    redrawPositions(t) { for (const t of this.cells)t.innerHTML = ''; for (const s of t) { const t = this.boardEl.children[s.position]; const i = document.createElement('div'); i.classList.add('character', s.character.type); const a = document.createElement('div'); a.classList.add('health-level'); const o = document.createElement('div'); o.classList.add('health-level-indicator', `health-level-indicator-${(e = s.character.health) < 15 ? 'critical' : e < 50 ? 'normal' : 'high'}`), o.style.width = `${s.character.health}%`, a.appendChild(o), i.appendChild(a), t.appendChild(i); } let e; }

    addCellEnterListener(t) { this.cellEnterListeners.push(t); }

    addCellLeaveListener(t) { this.cellLeaveListeners.push(t); }

    addCellClickListener(t) { this.cellClickListeners.push(t); }

    addNewGameListener(t) { this.newGameListeners.push(t); }

    addSaveGameListener(t) { this.saveGameListeners.push(t); }

    addLoadGameListener(t) { this.loadGameListeners.push(t); }

    onCellEnter(t) { t.preventDefault(); const e = this.cells.indexOf(t.currentTarget); this.cellEnterListeners.forEach(((t) => t.call(null, e))); }

    onCellLeave(t) { t.preventDefault(); const e = this.cells.indexOf(t.currentTarget); this.cellLeaveListeners.forEach(((t) => t.call(null, e))); }

    onCellClick(t) { const e = this.cells.indexOf(t.currentTarget); this.cellClickListeners.forEach(((t) => t.call(null, e))); }

    onNewGameClick(t) { t.preventDefault(), this.newGameListeners.forEach(((t) => t.call(null))); }

    onSaveGameClick(t) { t.preventDefault(), this.saveGameListeners.forEach(((t) => t.call(null))); }

    onLoadGameClick(t) { t.preventDefault(), this.loadGameListeners.forEach(((t) => t.call(null))); }

    static showError(t) { alert(t); }

    static showMessage(t) { alert(t); }

    selectCell(t, e = 'yellow') { this.deselectCell(t), this.cells[t].classList.add('selected', `selected-${e}`); }

    deselectCell(t) { const e = this.cells[t]; e.classList.remove(...Array.from(e.classList).filter(((t) => t.startsWith('selected')))); }

    showCellTooltip(t, e) { this.cells[e].title = t; }

    addToolTip(t) { const e = document.createElement('div'); e.className = 'toolTip', t.appendChild(e); }

    deleteToolTip(t) { t.querySelector('.toolTip').remove(), t.removeAttribute('title'); }

    hideCellTooltip(t) { this.cells[t].title = ''; }

    showDamage(t, e) { return new Promise(((s) => { const i = this.cells[t]; const a = document.createElement('span'); a.textContent = e, a.classList.add('damage'), i.appendChild(a), a.addEventListener('animationend', (() => { i.removeChild(a), s(); })); })); }

    setCursor(t) { this.boardEl.style.cursor = t; }

    checkBinding() { if (this.container === null) throw new Error('GamePlay not bind to DOM'); }
  }(); v.bindToDOM(document.querySelector('#game-container')); const y = new class {
    constructor(t) { this.storage = t; }

    save(t) { this.storage.setItem('state', JSON.stringify(t)); }

    load() { try { return JSON.parse(this.storage.getItem('state')); } catch (t) { throw new Error('Invalid state'); } }
  }(localStorage); const g = new class {
    constructor(t, e) { this.gamePlay = t, this.stateService = e, this.level = 1, this.charge = [], this.myPositions = [], this.compPositions = [], this.chosen = -1, this.select = -1, this.possibleMove = [], this.possibleAttack = [], this.turn = 1, this.score = 0, this.myTeam = [], this.compTeam = []; }

    init() { let a = t; this.level === 1 && (this.myTeam = d([o, l], 1, 2), this.compTeam = d([h, n], 1, 2)), this.level === 2 && (a = e, this.myTeam = d([o, l, c], 1, 1), this.gamePlay.positions.forEach(((t) => { this.myTeam.push(t.character); })), this.compTeam = d([h, n, r], 2, this.myTeam.length)), this.level === 3 && (a = s, this.myTeam = d([o, l, c], 2, 2), this.gamePlay.positions.forEach(((t) => { this.myTeam.push(t.character); })), this.compTeam = d([h, n, r], 3, this.myTeam.length)), this.level === 4 && (a = i, this.myTeam = d([o, l, c], 3, 2), this.gamePlay.positions.forEach(((t) => { this.myTeam.push(t.character); })), this.compTeam = d([h, n, r], 4, this.myTeam.length)), this.gamePlay.drawUi(a); const m = p.getPositions(this.myTeam, [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57]); const u = p.getPositions(this.compTeam, [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]); m.forEach(((t) => this.myPositions.push(t.position))), u.forEach(((t) => this.compPositions.push(t.position))), this.gamePlay.positions = m.concat(u), this.gamePlay.positions.forEach(((t) => this.charge.push(t.position))), this.myTeam = [], this.compTeam = [], this.gamePlay.redrawPositions(this.gamePlay.positions); for (let t = 0; t < this.gamePlay.cells.length; t += 1) this.gamePlay.cells[t].addEventListener('mouseenter', (() => this.onCellEnter(t))), this.gamePlay.cells[t].addEventListener('click', (() => this.onCellClick(t))), this.gamePlay.cells[t].addEventListener('mouseleave', (() => this.onCellLeave(t))); this.gamePlay.newGameEl.addEventListener('click', (() => this.newGame())), this.gamePlay.saveGameEl.addEventListener('click', (() => this.saveGame())), this.gamePlay.loadGameEl.addEventListener('click', (() => this.loadGame())); }

    newGame() { this.level = 1, this.charge = [], this.myPositions = [], this.compPositions = [], this.chosen = -1, this.select = -1, this.possibleMove = [], this.possibleAttack = [], this.turn = 1, this.score = 0, this.init(); }

    saveGame() {
      const t = {
        positions: this.gamePlay.positions, level: this.level, charge: this.charge, myPositions: this.myPositions, compPositions: this.compPositions, chosen: this.chosen, select: this.select, possibleMove: this.possibleMove, possibleAttack: this.possibleAttack, turn: this.turn, score: this.score,
      }; this.stateService.save(u.from(t));
    }

    loadGame() { const a = this.stateService.load(); this.gamePlay.positions = a.positions, this.level = a.level, this.charge = a.charge, this.myPositions = a.myPositions, this.compPositions = a.compPositions, this.chosen = a.chosen, this.select = a.select, this.possibleMove = a.possibleMove, this.possibleAttack = a.possibleAttack, this.turn = a.turn, this.score = a.score; let o = t; this.level === 2 && (o = e), this.level === 3 && (o = s), this.level === 4 && (o = i), this.gamePlay.drawUi(o), this.gamePlay.redrawPositions(this.gamePlay.positions); }

    onCellClick(t) { this.myPositions.includes(t) && (this.chosen !== -1 && this.gamePlay.deselectCell(this.chosen), this.gamePlay.selectCell(t), this.chosen = t); let e = ''; this.gamePlay.positions.forEach(((s) => { s.position === t && (s.character.type !== 'swordsman' && s.character.type !== 'bowman' && s.character.type !== 'magician' || (e = s.character.type)); })), this.moveAttack(e, t), this.chosen !== -1 && (this.possibleMove.includes(t) && !this.charge.includes(t) && (this.move(this.chosen, t), this.myPositions.splice(this.myPositions.indexOf(this.chosen), 1), this.myPositions.push(t), this.gamePlay.redrawPositions(this.gamePlay.positions), this.gamePlay.deselectCell(this.chosen), this.chosen = -1, this.turn = 0, this.compAction()), this.possibleAttack.includes(t) && this.compPositions.includes(t) && (this.attack(this.chosen, t), this.gamePlay.deselectCell(this.chosen), this.chosen = -1, this.turn = 0, this.compAction())); }

    onCellEnter(t) { if (this.charge.includes(t) && this.getTooltip(t), this.chosen !== -1) { this.possibleMove.includes(t) && !this.charge.includes(t) && (this.gamePlay.setCursor('pointer'), this.gamePlay.selectCell(t, 'green'), this.select = t); const e = this.compPositions.includes(t) && this.possibleMove.includes(t) && !this.possibleAttack.includes(t); this.possibleMove.includes(t) && !e || this.gamePlay.setCursor('not-allowed'), this.possibleAttack.includes(t) && this.compPositions.includes(t) && (this.gamePlay.setCursor('crosshair'), this.gamePlay.selectCell(t, 'red'), this.select = t); } }

    onCellLeave() { this.gamePlay.setCursor('auto'), this.select !== -1 && this.gamePlay.deselectCell(this.select); }

    levelUp() { this.level += 1, this.gamePlay.positions.forEach(((t) => { t.character.level += 1; const e = t.character.attack * (1.8 - 0.01 * t.character.health); t.character.attack = Math.max(t.character.attack, e); const s = t.character.defence * (1.8 - 0.01 * t.character.health); t.character.defence = Math.max(t.character.defence, s); const i = t.character.health + 80; t.character.health = i <= 100 ? i : 100; })), this.charge = [], this.myPositions = [], this.compPositions = [], this.chosen = -1, this.select = -1, this.possibleMove = [], this.possibleAttack = [], this.turn = 1, this.init(); }

    attack(t, e) { let s = -1; let i = -1; for (let a = 0; a < this.gamePlay.positions.length; a += 1) this.gamePlay.positions[a].position === t && (s = a), this.gamePlay.positions[a].position === e && (i = a); const a = this.gamePlay.positions[s].character.attack; const o = this.gamePlay.positions[i].character.defence; const l = Math.max(a - o, 0.1 * a); if (this.gamePlay.positions[i].character.health -= l, this.gamePlay.positions[i].character.health <= 0) { let t = []; t = this.turn === 1 ? this.compPositions : this.myPositions; for (let e = 0; e < t.length; e += 1)t[e] === this.gamePlay.positions[i].position && (this.turn === 1 ? this.compPositions.splice(e, 1) : this.myPositions.splice(e, 1)); this.gamePlay.positions.splice(i, 1), this.charge.splice(this.charge.indexOf(e), 1); const s = this.gamePlay.cells[e]; s.querySelector('.toolTip') && this.gamePlay.deleteToolTip(s); } this.gamePlay.redrawPositions(this.gamePlay.positions), this.myPositions.length === 0 ? alert('Провал...') : this.compPositions.length === 0 && (this.gamePlay.positions.forEach(((t) => { this.score += t.character.health; })), this.level === 4 ? alert('Победа!') : (alert('LEVEL UP!'), this.levelUp())); }

    move(t, e) { this.gamePlay.positions.forEach(((s) => { s.position === t && (s.position = e); })), this.charge.splice(this.charge.indexOf(t), 1), this.charge.push(e); const s = this.gamePlay.cells[t]; s.querySelector('.toolTip') && this.gamePlay.deleteToolTip(s); }

    moveAttack(t, e) { t !== 'swordsman' && t !== 'undead' || (this.possibleMove = this.farCounter(e, 4), this.possibleAttack = this.farCounter(e, 1)), t !== 'bowman' && t !== 'vampire' || (this.possibleMove = this.farCounter(e, 2), this.possibleAttack = this.farCounter(e, 2)), t !== 'magician' && t !== 'daemon' || (this.possibleMove = this.farCounter(e, 1), this.possibleAttack = this.farCounter(e, 4)); }

    farCounter(t, e) { const s = new Set(); for (let i = 0; i < e + 1; i += 1) for (let a = 0; a < e + 1; a += 1)t - 8 * i >= 0 && t % 8 - a >= 0 && s.add(t - 8 * i - a), t - 8 * i >= 0 && t % 8 + a < 8 && s.add(t - 8 * i + a), t % 8 - a >= 0 && t + 8 * i < 64 && s.add(t + 8 * i - a), t + 8 * i < 64 && t % 8 + a < 8 && s.add(t + 8 * i + a); return [...s].sort(((t, e) => t - e)); }

    compAction() { let t = ''; const e = this.compPositions[Math.floor(Math.random() * this.compPositions.length)]; this.gamePlay.positions.forEach(((s) => { s.position === e && (t = s.character.type); })), this.moveAttack(t, e); for (const t of this.charge) this.possibleMove.includes(t) && this.possibleMove.splice(this.possibleMove.indexOf(t), 1); let s = -1; for (const t of this.myPositions) this.possibleAttack.includes(t) && (s = t); if (s !== -1) this.attack(e, s); else { const t = this.moveToGoal(e); this.move(e, t), this.compPositions.splice(this.compPositions.indexOf(e), 1), this.compPositions.push(t), this.gamePlay.redrawPositions(this.gamePlay.positions); } this.turn = 1; }

    moveToGoal(t) { let e = -1; let s = -1; let i = 15; for (const s of this.myPositions)i > this.distance(t, s) && (i = this.distance(t, s), e = s); i = 15; for (const t of this.possibleMove)i > Math.abs(e - t) && (i = Math.abs(e - t), s = t); return s; }

    distance(t, e) { const s = Math.abs(Math.trunc(t / 8) - Math.trunc(e / 8)); const i = Math.abs(t % 8 - e % 8); return s > i ? s : i; }

    getTooltip(t) { const e = this.gamePlay.cells[t]; const s = this.gamePlay.positions; for (const i in s) if (t === s[i].position) { const a = s[i].character.type; u.selected === e || a !== 'bowman' && a !== 'swordsman' && a !== 'magician' || this.gamePlay.setCursor('pointer'); const o = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map(((t) => String.fromCodePoint(t))); const [l, h, n, c] = o; const r = `${l} ${s[i].character.level} ${h} ${s[i].character.attack} ${n} ${s[i].character.defence} ${c}  ${s[i].character.health}`; this.gamePlay.showCellTooltip(r, t), !e.querySelectorAll('.toolTip').length > 0 && this.gamePlay.addToolTip(e); } }
  }(v, y); g.init();
})();
