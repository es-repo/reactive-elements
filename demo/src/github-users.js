import { forkJoin, BehaviorSubject, Subject, of, merge } from 'rxjs';
import { map, mapTo, mergeScan, filter, startWith } from 'rxjs/operators';
import elem from 'r-elem';

// "Github users" component.
export default function githubUsers() {

  const n = 4;
  const { refreshClick$, users$, loading$ } = observables(n);

  const refreshAllBtn = refreshAllButton(loading$);
  refreshAllBtn.refresh$
    .pipe(
      mapTo(Array.from(Array(n).keys())))
    .subscribe(refreshClick$);

  return elem('div')
    .set(e => e.style.cssText = 'display:inline-block')
    .child(
      refreshAllBtn)
    .childMap(users$,
      (user$, i) => {
        const e = userItem(user$);
        e.refresh$.pipe(mapTo([i])).subscribe(refreshClick$);
        return e;
      },
      () => new Subject());
}

// "User item" component.
function userItem(user$) {

  const stub = elem('div')
    .set(e => e.style.cssText = 'align-items:center;justify-content:space-between')
    .state(user$, (e, v) => e.style.display = v !== undefined ? 'none' : 'flex')
    .child(
      elem('div')
        .set(e => e.style.cssText = 'width:32px;height:32px;margin:0.5rem;background:lightgrey;'),
      elem('div')
        .set(e => e.style.cssText = 'width:7rem;height:1rem;background:lightgrey;'),
      elem('div')
        .set(e => e.style.cssText = 'width:1rem;height:1rem;background:lightgrey;margin-left:0.5rem')
    );

  const refreshButton = elem('a')
    .set(e => e.innerHTML = '&#x21bb;')
    .set(e => e.style.cssText = 'border:none;color:#55c;margin-left:0.5rem;cursor:pointer;text-decoration:none;display:inline-block;width:1rem')
    .state(user$, (e, v) => v === undefined ? e.removeAttribute('href') : e.href = '');

  const item = elem('div')
    .set(e => e.style.cssText = 'align-items:center;justify-content:space-between;')
    .state(user$, (e, v) => e.style.display = v === undefined ? 'none' : 'flex')
    .child(
      elem('div')
        .set(e => e.style.cssText = 'display:flex;align-items:center;')
        .child(
          elem('img')
            .set(e => e.style.cssText = '1width:32px;height:32px;margin:0.5rem;')
            .state(user$.pipe(filter(v => v !== undefined)), (e, v) => e.src = v.avatar_url),
          elem('a')
            .set(e => e.style.cssText = 'width:7rem;color:#555')
            .set(e => e.target = '_blank')
            .state(user$.pipe(filter(v => v !== undefined)), (e, v) => e.innerText = v.login)
            .state(user$.pipe(filter(v => v !== undefined)), (e, v) => e.href = v.html_url)),
      refreshButton);

  return elem('div')
    .child(stub, item)
    .event('refresh', refreshButton.click$.preventDefault());
}

// "Refresh button" component.
function refreshAllButton(loading$) {

  const loading$Observer = new BehaviorSubject(false);
  loading$.subscribe(loading$Observer);

  return elem('a')
    .set(e => e.innerText = 'refresh all')
    .set(e => e.style.cssText = 'display:inline-block;color:#55c;margin:0.5rem;')
    .state(loading$, (e, v) => v ? e.removeAttribute('href') : e.href = '')
    .state(loading$, (e, v) => e.style.color = v ? 'lightgrey' : '#55c')
    .event('refresh', e => e.click$.preventDefault()
      .pipe(
        filter(() => !loading$Observer.getValue())));
}

function observables(n) {
  const userIndexes = Array.from(Array(n).keys());

  const refreshClick$ = new Subject();

  const usersIterator = getUsersIterator();
  const users$ = new Subject();
  refreshClick$
    .pipe(
      startWith(userIndexes),
      mergeScan((acc, v) => {
        const t = acc.slice();
        v.forEach(i => t[i] = undefined);
        acc = acc.map(i => Promise.resolve(i));
        v.forEach(i => acc[i] = usersIterator.next());
        return merge(of(t), forkJoin(acc));
      }, [])
    ).subscribe(users$);

  const loading$ = new BehaviorSubject(true);
  users$.pipe(
    map(v => v.some(i => i === undefined)))
    .subscribe(loading$);

  return { refreshClick$, users$, loading$ };
}

// User iterator.
function getUsersIterator() {

  function nextPageUrl(linkHeader) {
    const m = linkHeader.match(/<(.+)>; rel=\"next\"/);
    return m.length > 1 ? m[1] : null;
  }

  let buffer = [];
  let url = 'https://api.github.com/users?client_id=919316a744c2f52095fc&client_secret=58a8f8259a1d62df8f9a6042b03b7a2cc7a9923f&per_page=11';
  let request = null;
  let index = 0;
  const doSwap = index => index >= buffer.length && request === null;

  return {
    next: function () {
      if (doSwap(index)) {
        index = 0;
        buffer = [];
        request = new Promise(resolve => setTimeout(resolve, 500))
          .then(() => fetch(url))
          .then(r => {
            url = nextPageUrl(r.headers.get('link'));
            return r.json();
          })
          .then(r => {
            request = null;
            buffer = r;
            return this;
          })
          .catch(() => {
            request = null;
            buffer = [];
            return undefined;
          });
      }

      index++;
      const i = index - 1;

      if (request !== null) {
        return request.then(() => buffer[i]);
      }
      else {
        return Promise.resolve(buffer[i]);
      }
    }
  };
}