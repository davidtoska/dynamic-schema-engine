class Ok<T> implements IResult<T> {
    constructor(readonly value: T) {}
    isOk(): this is Ok<T> {
        return true;
    }
    isFailure(): this is Failure<T> {
        return false;
    }

    map<A>(f: (t: T) => A): IResult<A> {
        const value = f(this.value);
        return new Ok<A>(value);
    }
}

class Failure<T> implements IResult<T> {
    constructor(readonly message: string) {}
    isFailure(): this is Failure<T> {
        return true;
    }

    isOk(): this is Ok<T> {
        return false;
    }

    map<A>(_f: (t: T) => A): IResult<A> {
        return new Failure<A>(this.message);
    }
}

interface IResult<T> {
    isOk(): this is Ok<T>;
    isFailure(): this is Failure<T>;
    map<A>(f: (t: T) => A): IResult<A>;
}

export type Result<T> = Failure<T> | Ok<T>;
export namespace Result {
    export const ok = <T>(value: T) => new Ok<T>(value);
    export const failure = <T>(message: string) => new Failure<T>(message);
}
