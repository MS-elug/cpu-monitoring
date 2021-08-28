import { useEffect, useState } from 'react';
import { Observable, Subscription } from 'rxjs';

export function useObservable<T>(observable: Observable<T>, initialValue?: T): [T | undefined] {
  const [value, setValue] = useState<T | undefined>(initialValue);

  useEffect(() => {
    if (!observable) return;
    const subscription = new Subscription();
    console.log('subscribe')
    subscription.add(
      observable.subscribe((value) => {
        setValue(value);
      })
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [observable]);

  return [value];
}
