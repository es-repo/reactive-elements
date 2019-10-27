import { Subject, BehaviorSubject, merge } from 'rxjs';
import { map, filter, scan, pluck, mapTo } from 'rxjs/operators';
import elem from 'r-elem';

// "Tic Tac Toe" game component.
export default function ticTacToe() {

  const { game$, boardClick$, newClick$ } = observables();

  const bw = boardView(game$.pipe(pluck('board')));
  bw.boardClick$.subscribe(boardClick$);

  const wv = gameResultView(game$.pipe(pluck('winner')));
  const ngv = newGameView(game$.pipe(pluck('winner')));
  ngv.newClick$.subscribe(newClick$);

  return elem('div')
    .set(e => e.style.cssText = 'display:inline-flex;flex-direction:column')
    .child(bw, wv, ngv);
}

// "Board view" component.
function boardView(board$) {
  const boardClick$ = new Subject();
  return elem('div')
    .childMap(board$,
      (row$, i) => {
        const rv = rowView(row$);
        rv.rowClick$
          .pipe(
            map(v => ({ ...v, row: i })))
          .subscribe(boardClick$);
        return rv;
      }, () => new Subject())
    .event('boardClick', boardClick$);
}

// "Row view" component.
function rowView(row$) {
  const rowClick$ = new Subject(undefined);
  return elem('div')
    .set(e => e.style.cssText = 'display:flex;')
    .childMap(row$,
      (cell$, i) => {
        const cv = cellView(cell$);
        cv.cellClick$
          .pipe(
            map(v => ({ column: i, chip: v })))
          .subscribe(rowClick$);
        return cv;
      }, () => new Subject())
    .event('rowClick', rowClick$);
}

// "Cell view" component.
function cellView(cell$) {
  const cell$Observer = new BehaviorSubject(undefined);
  cell$.subscribe(cell$Observer);
  return elem('div')
    .set(e => e.style.cssText = 'border:1px solid black;display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;cursor:pointer')
    .state(cell$, (e, v) => e.innerText = v === undefined ? '' : v)
    .event('cellClick', e =>
      e.click$.pipe(map(() => cell$Observer.value)));
}

// "Game result view" component.
function gameResultView(winner$) {
  return elem('div')
    .set(e => e.style.cssText = 'display:flex;justify-content:center;align-items:center;font-weight:bold;margin:0.5rem')
    .state(winner$, (e, v) => e.innerText = v === undefined ? '' : v === 'draw' ? 'Draw!' : `${v} won!`);
}

// "New game view" component.
function newGameView(winner$) {
  return elem('button')
    .set(e => e.innerText = 'New game')
    .state(winner$, (e, v) => e.style.display = v === undefined ? 'none' : '')
    .event('newClick', e => e.click$);
}

function observables() {

  function getWinner(board) {

    for (let i = 0; i < board.length; i++) {
      let hasWinner = true;
      for (let j = 1; j < board[i].length; j++) {
        if (board[i][0] === undefined || board[i][j] !== board[i][0]) {
          hasWinner = false;
          break;
        }
      }
      if (hasWinner) {
        return board[i][0];
      }
    }

    for (let i = 0; i < board.length; i++) {
      let hasWinner = true;
      for (let j = 1; j < board[i].length; j++) {
        if (board[0][i] === undefined || board[j][i] !== board[0][i]) {
          hasWinner = false;
          break;
        }
      }
      if (hasWinner) {
        return board[0][i];
      }
    }

    const diag1 = board.map((r, i) => board[i][i]);
    if (diag1.every(c => c === board[0][0]))
      return board[0][0];

    const diag2 = board.map((r, i) => board[i][board.length - i - 1]);
    if (diag2.every(c => c === board[0][board.length - 1]))
      return board[0][board.length - 1];

    if (board.flat().every(c => c !== undefined)) {
      return 'draw';
    }

    return undefined;
  }

  const chip1 = '❌';
  const chip2 = '◯';

  const boardClick$ = new Subject();
  const playerMove$ = boardClick$
    .pipe(
      filter(v => v.chip === undefined),
      scan((acc, v) =>
        ({ ...v, chip: acc.chip === chip1 ? chip2 : chip1 }),
        { chip: chip2 })
    );

  const newClick$ = new Subject();

  const seed = () => ({
    winner: undefined,
    board: [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ]
  });

  const game$ = new BehaviorSubject(seed());

  merge(playerMove$, newClick$.pipe(mapTo('new')))
    .pipe(
      scan((acc, v) => {
        if (v === 'new')
          return seed();

        acc.board[v.row][v.column] = v.chip;
        acc.winner = getWinner(acc.board);
        return acc;
      }, seed())).subscribe(game$);

  return { game$, boardClick$, newClick$ };
}