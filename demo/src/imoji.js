import { from, zip, interval, concat } from 'rxjs';
import { repeat, take } from 'rxjs/operators';
import elem from 'r-elem';

// "Imoji" component.
export default function imoji() {
  const d = ['(•_•)', '(•_•)>⌐■-■', '(⌐■_■)'];
  // const d = ['( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°)ﾉ⌐■-■', '(⌐ ͡■ ͜ʖ ͡■)'];
  const $ = zip(
    interval(1000)
      .pipe(
        take(d.length * 2)),
    concat(
      from(d),
      from(d.slice().reverse())
    ),
    (i, v) => v)
    .pipe(
      repeat());

  return elem('span')
    .child(
      elem('span')
        .set(e => e.style.cssText = 'line-height:1rem;')
        .state($, (e, v) => e.innerText = v));
}