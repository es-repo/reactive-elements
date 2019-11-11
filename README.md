# Reactive Elements

A JavaScript library for building user interfaces based on RxJS observables 🚀 

## Key features

- Observables are inputs of components, observables are outputs via events.

- No explicit component life-cycle. Component's life time is defined by its bound observables. A component's element is added to the document when any bound observable starts to emit values and removed from the document when all bound observables are completed. All subscriptions to element's event observables are automatically unsubscribed.

- Component updates its state as soon as new value emitted from a bound observable. As result no need in special change detection mechanism. And no need to use immutable data what gives performance, although immutable data still could be a good choice.

- Only those attributes, innerText and etc which are bound to the observable via bind function are updated. Component itself does not need to re-render. As result no need in Virtual DOM to gain good performance.

- Rendering of lists doesn't require "key" property like in other libraries for cresting UI components.


## API

- **elem(tagOrEl)** - Create a component.

- **set(setFunc)** - Set component element's attributes, inner text with static values.

- **state($, bind)** - Bind an observable to component element's attributes, inner text or create child elements based on the observable values. The observable should be hot!

- **event(name, ...create$Or$)** - Assign an observable event. The function takes event name and observables or functions which return observable and then merge all the observables. The merged observable can be accessed by calling [eventName+'$'].
Native element's events should be accessed without prior assignation. 

- **slot(name, slotElem)** - Add a named slot element.

- **child(...ch)** - Set this element as parent of the child elements.

- **slotChild(name, ...ch)** - Set a named slot as parent of the child elements.

- **childMap(arr$, createEl)** - The same as **slotChildMap** but set this element as parent. 

- **slotChildMap(name, arr$, createEl)** - Map the observable of array values to elements. This is used for creation of list of elements. It takes an observable of arrays, converts it to an array of observables. Then maps every such observable to an element. Sets the named slot as parent of every mapped element.

- **parent(p)** - Set parent for the element. This function should be called after all calls of **state** function.

- **el** - access the component's element.


## Examples

- A component which displays 1, 2, 3... every second:
```
() => elem('div').state(interval(1000), (e, v) => e.innerText = v)
```

- A component which consists of input field and label. It takes value from the input and writes it to the label.
```
() => { 
  const field = elem('input')
  const label = elem('label').state(field.input$, (e, v) => e.innerText = v)
  return elem('div').child(field, label);
}
```

- Attach a component to document's body:
```
const comp = elem('div').state(interval(1000), (e, v) => e.innerText = v);
elem(document.body).child(comp);
```

- More examples on **[demo](https://es-repo.github.io/reactive-elements/demo/dist/)** page.
