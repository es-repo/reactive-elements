import elem from './r-elem';
import { scan } from 'rxjs/operators';
import codeHighlighter from 'highlight.js';

// "Panel" component.
export default function panel(title, sourceCode) {

  const codeButton = elem('a')
    .set(e => e.style.cssText = 'background-color:#a49;color:white;margin-top:1rem;display:inline-block;padding:0.2rem')
    .set(e => e.href = '')
    .set(e => e.innerHTML = 'source code');

  const showCode$ = codeButton.click$.preventDefault()
    .pipe(scan(show => !show, false));

  const code =
    elem('code')
      .set(e => e.class = "js")
      .set(e => e.innerHTML = sourceCode);

  codeHighlighter.highlightBlock(code.el);

  return elem('fieldset')
    .child(
      elem('legend')
        .child(
          elem('h2')
            .set(e => e.innerHTML = title)))
    .slot('body',
      elem('div'))
    .child(
      codeButton,
      elem('pre')
        .child(code)
        .state(showCode$, (e, v) => e.style.display = v ? 'block' : 'none'));
}
