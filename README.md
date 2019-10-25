# Reactive Elements

A JavaScript library for building user interfaces based on RxJS observables 🚀 
### [Demo](https://es-repo.github.io/reactive-elements/demo/dist/) 

## Key features

- Observables are inputs of components, observables are outputs via events.

- No implicit component life-cycle. A component's element is added to the document when any bound observable starts to emit values and removed from the document when all bound observables are completed. All subscriptions to element's event observables are automatically unsubscribed.



## API

- **elem(tagOrEl)** - Create a component.

- **set(setFunc)** - Set element's attributes, inner text with static values.

- **state($, bind)** - Bind an observable to element's attributes, inner text or create child elements based on the observable values. The observable should be hot!

- **event(name, ...create$Or$)** - Assign an observable event. The function takes event name and observables or functions which return observable and then merge all the observables. The merged observable can be accessed by calling [eventName+'$'].
Native element's events should be accessed without prior assignation. 

- **slot(name, slotElem)** - Add a named slot element.

- **child(...ch)** - Set this element as parent of the child elements.

- **slotChild(name, ...ch)** - Set a named slot as parent of the child elements.

- **childMap(arr$, createEl)** - The same as **slotChildMap** but set this element as parent. 

- **slotChildMap(name, arr$, createEl)** - Take an observable of arrays, convert it to an array of observables. Map every such observable to an element. Set the named slot as parent of every mapped element.

- **parent(p)** - Set parent for the element. This function should be called after all calls of **state** function.

- **el** - access the component's element


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
- More examples on [demo](https://es-repo.github.io/reactive-elements/demo/dist/) page
