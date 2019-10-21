import { merge, of, empty } from 'rxjs';
import { delay } from 'rxjs/operators';

export function durableValue(v, duration) {
  return merge(of(v), empty().pipe(delay(duration)));
}