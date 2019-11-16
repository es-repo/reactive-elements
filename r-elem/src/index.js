import { race, fromEvent, forkJoin, merge, isObservable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

export default function elem(tagOrEl) {

  const el = tagOrEl instanceof HTMLElement ? tagOrEl : document.createElement(tagOrEl);
  const slots = {};
  const state$AndBinds = [];
  const eventSubscriptions = [];

  return new Proxy({
    el,

    // Set element's attributes, inner text with static values.
    set(setFunc) {
      setFunc(el);
      return this;
    },

    // Bind an observable to element's attributes, inner text
    // or create child elements based on the observable values.
    //
    // The observable should be hot!
    state($, bind) {
      if (isObservable($)) {
        bind = bind || (() => { });
        state$AndBinds.push({ state$: $, bind });
      }
      else {
        this.set(e => bind(e, $));
      }
      return this;
    },

    // Assign an observable event.
    // 
    // The function takes event name and observables or functions which return observable
    // and then merge all the observables.
    // The merged observable can be accessed by calling [eventName+'$'].
    event(name, ...create$Or$) {
      const arrayOf$ = create$Or$.map(i => typeof i === 'function' ? i(this) : i);
      this[name + '$'] = merge(...arrayOf$);
      return this;
    },

    // Add a named slot element.
    slot(name, slotElem) {
      slots[name] = slotElem.el;
      el.appendChild(slotElem.el);
      this[name + "Child"] = (...ch) => this.slotChild(name, ...ch);
      return this;
    },

    // Set this element as parent of the child elements.
    child(...ch) {
      return this.slotChild(undefined, ...ch);
    },

    // Set a named slot as parent of the child elements.
    // If a child is not an element but a string, number, date or other value
    // then a text node will be created with the value.toString() content.
    slotChild(name, ...ch) {
      const p = slots[name] || el;
      ch
        .filter(c => c !== undefined && c !== null && c !== "")
        .forEach(c => {
          if (isElem(c)) 
            c.parent(p);
          else 
            p.appendChild(document.createTextNode(c.toString()));
        });
      return this;
    },

    // The same as "slotChildMap" but set this element as parent.
    childMap(arr$, createEl, newSubject) {
      return this.slotChildMap(undefined, arr$, createEl, newSubject);
    },

    // - Take an observable of arrays, convert it to an array of observables;
    // - map every observable to an element;
    // - set the named slot as parent of every mapped element.
    // 
    // TODO: the 'newSubject' factory argument is required because of bug in RxJS:
    // https://github.com/ReactiveX/rxjs/issues/5105
    // Remove the argument as soon as the bug will be fixed.
    slotChildMap(name, arr$, createEl, newSubject) {
      const p = slots[name] || el;
      const item$s = [];
      arr$.subscribe(v => {
        for (let i = 0; i < v.length; i++) {
          if (item$s[i] === undefined) {
            item$s[i] = newSubject();
            createEl(item$s[i].asObservable(), i)
              .state(item$s[i])
              .parent(p);
          }
          item$s[i].next(v[i]);
        }

        for (let i = v.length; i < item$s.length; i++) {
          item$s[i].complete();
        }
        item$s.length = v.length;
      });

      return this;
    },

    // Set parent for the element.
    // 
    // If no state is bound then add this element as a child to a parent element immediately.
    // Otherwise:
    // - subscribe to all observable states and make binding to happen;
    // - add this element to a parent as soon as any observable state emits a value;
    // - remove this element from parent as soon as all observable states completed.
    //
    // This function should be called after all calls of "state" function.
    parent(p) {
      if (state$AndBinds.length === 0) {
        p.appendChild(el);
        return this;
      }

      const state$s = state$AndBinds.map(o => o.state$);

      race(state$s)
        .pipe(
          take(1))
        .subscribe(() => p.appendChild(el));

      forkJoin(state$s)
        .subscribe(null, null, () => {
          p.removeChild(el);
          eventSubscriptions.forEach(s => s.unsubscribe());
        });

      state$AndBinds.forEach(o =>
        o.state$.subscribe(v => o.bind(el, v)));

      return this;
    }
  },

    {
      get(target, property) {
        // A hook for element's native events.
        if (property.endsWith('$') && target[property] === undefined) {
          const eventName = property.substring(0, property.length - 1);
          const $ = fromEvent(target.el, eventName);
          $.preventDefault = () => $.pipe(tap(e => e.preventDefault()));

          const subscribe = $.subscribe;
          $.subscribe = function () {
            const subscription = subscribe.apply($, arguments);
            eventSubscriptions.push(subscription);
            return subscription;
          };

          target[property] = $;
        }

        return target[property];
      }
    });
}

function isElem(o) {
  // Silly check but enough for now.
  return o.parent !== undefined && o.state !== undefined;
}
















/** Hire me! ༼ つ ◕_◕ ༽つ - eugene.github [at] gmail [dot] com -  */
