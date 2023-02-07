export type Maybe<T> = Just<T> | None<T>;

class Just<T> {
  isJust(): this is Just<T> {
    return true;
  }
  constructor(readonly value: T) {}
  isNone(): this is None<T> {
    return false;
  }

  map<A>(f: (t: T) => A) {
    const newValue = f(this.value);
    return new Just<A>(newValue);
  }
}

class None<T> {
  readonly kind: "none" = "none";
  isJust(): this is Just<T> {
    return false;
  }
  isNone(): this is None<T> {
    return false;
  }

  // @ts-ignore
  map<A>(f: (t: T) => A) {
    return new None<A>();
  }
}

export namespace Maybe {
  export const none = () => new None();
  export const just = <T>(value: T) => new Just(value);

  export const isNone = <T>(value?: Maybe<T>): value is None<T> =>
    value instanceof None;
  export const isJust = <T>(value?: Maybe<T>): value is Just<T> =>
    value instanceof Just;

  export const is = <T>(value: unknown): value is Maybe<T> => {
    const casted = value as any as Maybe<T>;
    return isNone(casted) || isJust(casted);
  };
}
