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
    .state(winner$, (e, v) => e.innerText = v === undefined ? '' : v === 'draw' ? 'draw!' : `${v} won!`);
}

// "New game view" component.
function newGameView(winner$) {
  return elem('button')
    .set(e => e.innerText = 'new game')
    .state(winner$, (e, v) => e.style.display = v === undefined ? 'none' : '')
    .event('newClick', e => e.click$);
}

function observables() {

  function getWinner(board) {

    const flatBoard = board.flat();
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (flatBoard[a] && flatBoard[a] === flatBoard[b] && flatBoard[a] === flatBoard[c]) {
        return flatBoard[a];
      }
    }

    if (flatBoard.every(c => c !== undefined)) {
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
    board: Array(3).fill(undefined).map(() => Array(3).fill(undefined))
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