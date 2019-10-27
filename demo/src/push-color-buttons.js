import { race, interval, BehaviorSubject, Subject } from 'rxjs';
import { map, pluck, take, repeat, scan, mapTo, startWith } from 'rxjs/operators';
import elem from 'r-elem';

// "Push color buttons" widget.
export default function pushColorButtons() {

  const { click$, items$, counts$ } = observables();

  return elem('div')
    .set(e => e.style.cssText = 'display:flex;')
    .child(
      elem('ul')
        .set(e => e.style.cssText = "width:6rem")
        .childMap(items$,
          $ => {
            const item = colorItem($);
            item.itemClick$.subscribe(click$);
            return elem('il')
              .child(
                item);
          }, () => new Subject()),
      colorClickedCounts(counts$)
        .set(e => e.style.cssText = 'margin-top: 0.5rem;'));
}

// "Color item" component.
function colorItem(item$) {
  const item$Observer = new BehaviorSubject(undefined);
  item$.subscribe(item$Observer);

  const button = colorButton(
    item$.pipe(pluck('name')),
    item$.pipe(pluck('color')),
    item$.pipe(pluck('dark')));

  return elem('div')
    .set(e => e.style.cssText = 'display:flex;animation: fade-in 1s ease;')
    .child(
      elem('div')
        .set(e => e.style.cssText = `display:inline-block;margin:5px;width:10px;height:10px;transition:background-color 1s`)
        .state(item$.pipe(pluck('color')), (e, color) => (e.style.backgroundColor = color)),
      button)
    .event('itemClick',
      button.click$.pipe(map(() => item$Observer.getValue())));
}

// "Color button" component.
function colorButton(content$, color$, dark$) {
  const color$Observer = new BehaviorSubject(undefined);
  color$.subscribe(color$Observer);

  return elem('button')
    .set(e => e.style.cssText = 'transition:background-color 1s;width:3rem')
    .state(content$, (e, v) => e.innerHTML = v)
    .state(color$, (e, v) => e.style.backgroundColor = v)
    .state(dark$, (e, v) => { e.style.color = v; e.style.borderColor = v; })
    .event('colorClick',
      e => e.click$
        .pipe(
          map(() => color$Observer.getValue())));
}

function colorClickedCounts(counts$) {
  return elem('div')
    .childMap(
      counts$.pipe(
        map(v => Object.values(v))),
      $ => elem('div')
        .set(e => e.style.cssText = 'white-space:nowrap;margin-top:0.4rem')
        .state($,
          (e, v) => e.innerHTML = `<span style="color:${v.item.dark}">${v.item.name}</span> clicked ${v.count} times`),
      () => new Subject());
}

function observables() {
  const colors = [
    { name: 'green', color: '#afa', dark: '#5a5' },
    { name: 'red', color: '#faa', dark: '#a55' },
    { name: 'blue', color: '#aaf', dark: '#55a' },
    { name: 'orange', color: '#fca', dark: '#a85' },
    { name: 'yellow', color: '#ffa', dark: '#aa5' },
    { name: 'purple', color: '#caf', dark: '#85a' }
  ];

  function getRandomItems() {
    const r = colors.filter(() => Math.random() > 0.4);
    return r.length === 0 ? [colors[Math.floor(Math.random() * colors.length)]]
      : r;
  }

  function getSameItems(item, length) {
    return new Array(length).fill(item);
  }

  const click$ = new Subject();

  const items$ =
    race(
      interval(1000).pipe(mapTo(undefined)),
      click$)
      .pipe(
        take(1),
        repeat(),
        scan((acc, v) => v === undefined ? getRandomItems()
          : getSameItems(v, acc.length),
          startWith([])));

  const countsSeed = colors.reduce(
    (acc, v) => ({ ...acc, [v.name]: { item: v, count: 0 } }),
    {});

  const counts$ = click$.pipe(
    scan((acc, v) => { acc[v.name].count++; return acc; }, countsSeed),
    startWith(countsSeed));

  return { click$, items$, counts$ };
}
