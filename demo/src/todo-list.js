import { BehaviorSubject, Subject, merge } from 'rxjs';
import { map, filter, tap, startWith, scan } from 'rxjs/operators';
import elem from 'r-elem';

// "Todo list" component.
export default function todoList() {

  const { state$, action$ } = observables();

  const addItem = addTodoItem();
  addItem.add$.subscribe(v =>
    action$.next({ type: 'addItem', payload: { item: v } }));

  return elem('div')
    .child(
      elem('div')
        .set(e => e.style.cssText = 'display:inline-flex;flex-direction:column;margin-bottom:0.5rem;')
        .childMap(state$, $ => {
          const el = todoItem($);
          merge(
            el.delete$.pipe(map(v => ({ type: 'deleteItem', payload: { item: v } }))),
            el.done$.pipe(map(v => ({ type: 'doneItem', payload: { item: v, done: true } }))),
            el.undone$.pipe(map(v => ({ type: 'doneItem', payload: { item: v, done: false } })))
          ).subscribe(action$);

          return el;
        }, () => new Subject()),
      addItem);
}

// "Todo item" component.
function todoItem(item$) {

  const deleteButton = elem('button')
    .state(item$)
    .set(e => e.style.cssText = 'border:none;color:red;margin-left:0.5rem;cursor:pointer;')
    .set(e => e.innerText = '✖');

  const doneCheckbox = elem('input')
    .set(e => e.type = 'checkbox')
    .set(e => e.style.cssText = 'margin-right:0.5rem')
    .state(item$, (e, v) => e.checked = v.done);

  const item$Observer = new BehaviorSubject({});
  item$.subscribe(item$Observer);

  return elem('div')
    .set(e => e.style.cssText = "display:flex;align-items:center;justify-content:space-between")
    .child(
      elem('div')
        .child(
          doneCheckbox,
          elem('span')
            .state(item$, (e, v) => e.style.textDecoration = v.done ? 'line-through' : '')
            .state(item$, (e, v) => e.innerText = v.text)),
      deleteButton)
    .event('delete',
      deleteButton.click$
        .pipe(
          map(() => item$Observer.getValue())))
    .event('done',
      doneCheckbox.change$
        .pipe(
          filter(v => v.target.checked),
          map(() => item$Observer.getValue())))
    .event('undone',
      doneCheckbox.change$
        .pipe(
          filter(v => !v.target.checked),
          map(() => item$Observer.getValue()))
    );
}

function addTodoItem() {

  const input = elem('input').
    set(e => e.style.cssText = 'margin-right:0.5rem;');

  const addButton = elem('button')
    .set(e => e.innerText = 'add')
    .state(input.input$.pipe(
      map(v => v.target.value.trim() === ''),
      startWith(true)),
      (e, v) => { e.disabled = v; });

  const createNewItemSequence = [
    map(() => input.el.value.trim()),
    filter(v => v !== ''),
    map(v => ({ text: v, done: false })),
    tap(() => { input.el.value = ''; input.el.dispatchEvent(new Event('input')); })];

  return elem('div')
    .child(
      input,
      addButton)
    .event('add',
      addButton.click$
        .pipe(...createNewItemSequence),
      input.keypress$
        .pipe(
          filter(
            v => v.keyCode === 13),
          ...createNewItemSequence));
}

// Redux-style management state.
function observables() {
  const reducers = {
    deleteItem(state, payload) {
      return state.filter(i => i !== payload.item);
    },

    addItem(state, payload) {
      return [...state, payload.item];
    },

    doneItem(state, payload) {
      payload.item.done = payload.done;
      return state;
    }
  };

  const action$ = new Subject();

  const seed = [
    { text: 'Go for a walk', done: true },
    { text: 'Train body', done: false },
    { text: 'Drink a cappuccino', done: false },
  ];
  const state$ = action$
    .pipe(
      scan((s, a) => reducers[a.type](s, a.payload), seed),
      startWith(seed));

  return { state$, action$ };
}