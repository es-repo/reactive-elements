import { BehaviorSubject, Subject, merge, combineLatest, from } from 'rxjs';
import { map, mapTo, filter, scan, flatMap, startWith } from 'rxjs/operators';
import elem from 'r-elem';

// "Files & Folders" component.
export default function filesAndFolders() {
  const seed = {
    name: '..', type: 'folder', child: undefined
  };

  const tree$ = new BehaviorSubject(seed);

  const tw = treeView(tree$);
  tw.nodeClick$.
    pipe(
      filter(v => v.type === 'folder' && v.child === undefined),
      flatMap(v => from(randomFilesAndFoldersAsync())
        .pipe(
          map(ch => { v.child = ch; return v; }))),
      mapTo(seed))
    .subscribe(tree$);

  return tw;
}

// "Tree view" component.
function treeView(tree$) {

  const nodeClick$ = new Subject();

  const node = treeNode(tree$);
  node.nodeClick$.subscribe(nodeClick$);

  return elem('div')
    .set(e => e.style.cssText = 'margin-left:1rem;')
    .child(
      node
    )
    .childMap(
      tree$.pipe(
        map(v => v.child),
        filter(v => v !== undefined)),
      (subTree$) => {
        const e = treeView(subTree$);
        e.state(node.isOpen$, (e, v) => e.style.display = v ? '' : 'none');
        e.nodeClick$.subscribe(nodeClick$);
        return e;
      },
      () => new Subject())
    .event('nodeClick', nodeClick$);
}

// "Tree node" component.
function treeNode(tree$) {

  const isOpen$ = new Subject();

  const icon$ = combineLatest(tree$, isOpen$.pipe(startWith(false)),
    (tree, isOpen) => tree.type === 'folder' ? isOpen ? '📂' : '📁' : '📃');

  const isFolder$ = tree$.pipe(
    map(v => v.type === 'folder'));

  const loading$ = new Subject();

  const tree$Observer = new BehaviorSubject(undefined);
  tree$.subscribe(tree$Observer);

  const textElem = elem('div')
    .state(tree$, (e, v) => e.innerHTML = v.name);

  textElem.mouseover$.subscribe(() => {
    if (tree$Observer.getValue().type === 'folder')
      textElem.el.style.textDecoration = 'underline';
  });

  textElem.mouseout$.subscribe(() => {
    if (tree$Observer.getValue().type === 'folder')
      textElem.el.style.textDecoration = 'none';
  });

  const nodeElem = elem('div')
    .set(e => e.style.cssText = 'display:flex;align-items:center;')
    .state(tree$)
    .state(
      isFolder$,
      (e, v) => e.style.cursor = v ? 'pointer' : 'default')
    .child(
      elem('div')
        .state(icon$, (e, v) => e.innerHTML = v),
      textElem,
      elem('div')
        .set(e => e.style.cssText = 'margin-left:0.5rem')
        .state(loading$, (e, v) => e.innerHTML = v ? '🔄' : '')
    );

  nodeElem.click$.pipe(
    filter(() => tree$Observer.getValue().type === 'folder'),
    scan(acc => !acc, false))
    .subscribe(isOpen$);

  merge(
    nodeElem.click$.pipe(
      map(() => tree$Observer.getValue()),
      filter(v => v.child === undefined),
      mapTo(true)),
    tree$.pipe(
      filter(v => v.child !== undefined),
      mapTo(false)))
    .subscribe(loading$);

  return nodeElem
    .event('nodeClick',
      nodeElem.click$
        .pipe(
          map(() => tree$Observer.getValue())))
    .event('isOpen', isOpen$);
}

function randomFilesAndFoldersAsync() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(randomFilesAndFolders()), 500);
  });
}

function randomFilesAndFolders(attempt) {
  attempt = attempt === undefined ? 0 : attempt;
  const n = 2 + Math.ceil(Math.random() * 3);
  const r = Array.from(Array(n))
    .map(randomFileOrFolder);
  r.sort(a => a.type === 'folder' ? -1 : 1);
  return attempt >= 10 || r.some(i => i.type === 'folder') ? r
    : randomFilesAndFolders(attempt++);
}

function randomFileOrFolder() {
  const type = Math.random() > 0.6 ? 'folder' : 'file';
  return {
    name: randomName(),
    type,
    child: type === 'folder' ? undefined : []
  };
}

function randomName() {
  const n = 3 + Math.ceil(Math.random() * 5);
  return Array.from(Array(n))
    .map(() => 97 + Math.floor(Math.random() * 26))
    .map(i => String.fromCharCode(i))
    .join('');
}