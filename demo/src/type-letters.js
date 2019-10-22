import { merge } from 'rxjs';
import { mapTo, scan, delay, startWith } from 'rxjs/operators';
import { durableValue } from './rxjs-operators';
import elem from './r-elem';

const animDuration = 2000;

// "Type letters" component.
export default function typeLetters() {

  const kb = keyboard();

  const text$ = merge(
    kb.clear$,
    kb.letter$
      .pipe(
        delay(animDuration)))
    .pipe(
      scan((a, v) => v === undefined ? '' : a + v, ''),
      startWith(''));

  return elem('div')
    .child(
      tape(kb.letter$, text$),
      kb);
}

// "Tape" component.
function tape(letter$, text$) {
  return elem('div')
    .set(e => e.style.cssText = 'display:flex;border-bottom:1px solid black;border-top:1px solid black;background-color:#dddd;height:2rem;')
    .child(
      text(text$),
      letters(letter$)
    );
}

// "Letters" component.
function letters(letter$) {
  return elem('div')
    .set(e => e.style.cssText = "position:relative;width:100%;height:100%")
    .state(letter$, (e, v) =>
      elem('div')
        .set(e => e.style.cssText =
          `position:absolute;display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:1.5em;
          font-weight:bold;animation:down-and-left ${animDuration}ms;linear`)
        .state(durableValue(v, animDuration - 20), (e, v) => e.innerHTML = v)
        .parent(e));
}

// "Text" component.
function text(text$) {
  return elem('div')
    .set(e => e.style.cssText = 'display:flex;align-items:center;white-space:nowrap;font-size:1.5rem;font-weight:bold;margin-right:0.5rem;')
    .state(
      text$,
      (e, v) => e.innerHTML = v);
}

// "Keyboard" component.
function keyboard() {
  const letterButtons = Array.from(' abcdefghijklmnopqrstuvwxyz')
    .map(l => letterButton(l));

  const clearButton = elem('button')
    .set(e => e.innerHTML = 'clear')
    .set(e => e.style.cssText = 'background:#dfd;height:1.5rem');

  const letter$ = merge(
    ...letterButtons.map(b => b.letter$));

  return elem('div')
    .set(e => e.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:space-around;margin-top:2rem')
    .child(
      ...letterButtons,
      clearButton)
    .event('letter', letter$)
    .event('clear', clearButton.click$.pipe(mapTo(undefined)));
}

function letterButton(letter) {
  return elem('button')
    .set(e => e.style.cssText = 'width:2rem;height:1.5rem')
    .set(e => e.innerHTML = letter)
    .event('letter', e => e.click$.pipe(mapTo(letter)));
}