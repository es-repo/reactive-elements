import elem from './r-elem';

// "Panel" component.
export default function panel(title) {
  return elem('fieldset')
    .child(
      elem('legend')
        .set(e => e.innerHTML = title)
        .set(e => e.style.cssText = 'font-weight:bold'))
    .slot('body',
      elem('div'));
}