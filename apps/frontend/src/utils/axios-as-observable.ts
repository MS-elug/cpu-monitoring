import axios, { AxiosResponse } from 'axios';
import { Observable, PartialObserver } from 'rxjs';

/** Convert an axios reponse into a Observable with cancelation feature */
export function axiosAsObservable<T>(axiosResponse: Promise<AxiosResponse<T>>, valueOnTimeout?: T, valueOnError?: T) {
  return new Observable((observer: PartialObserver<T>) => {
    const cancelToken = axios.CancelToken.source();

    axiosResponse.then(
      (result) => {
        observer.next?.(result.data);
        observer.complete?.();
      },
      (error) => {
        if (axios.isCancel(error)) {
          // If request is cancel, don't raise an error, simply complete
          if (valueOnTimeout) {
            observer.next?.(valueOnTimeout);
          }
          observer.complete?.();
        } else {
          if (valueOnError) {
            observer.next?.(valueOnError);
          }
          observer.error?.(error);
        }
      }
    );

    // When observable is unsubscribed, cancel the request to avoid keeping pending connection
    return () => cancelToken.cancel();
  });
}
