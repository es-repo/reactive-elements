import { map } from 'rxjs/operators';
import elem from './r-elem';

// "Mirror input" component.
export default function mirrorInput() {

  const input = elem('input')
    .set(e => e.style.cssText = 'margin-bottom:1rem');

  return elem('div')
    .set(e => e.style.cssText = 'display:flex;flex-direction:column;height:3rem')
    .child(
      input,
      elem('label')
        .state(
          input.input$
            .pipe(
              map(v => v.target.value)),
          (e, v) => e.innerHTML = v));
}