import {
  catchError,
  concatMap,
  distinctUntilChanged,
  interval,
  map,
  Observable,
  of,
  OperatorFunction,
  pipe,
  share,
} from "rxjs";
import { fromFetch } from "rxjs/fetch";

/**
 * Creates a new observable that requests the status from the server once per
 * second and emits the responses.
 *
 * @returns A new observable.
 */
export function status(): Observable<Response> {
  return interval(1000).pipe(
    concatMap(() =>
      // FIXME: err is not of type Response
      fromFetch("/api/status").pipe(catchError((err) => of(err)))
    ),
    share()
  );
}

/**
 * RxJS operator that emits `true` when the status changes from not OK to OK
 * and false when the status changes from OK to not OK.
 *
 * @returns The operator function.
 */
export function statusOk(): OperatorFunction<Response, boolean> {
  return pipe(
    map((value) => value.ok),
    distinctUntilChanged()
  );
}
