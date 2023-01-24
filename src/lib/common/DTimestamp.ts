export type DTimestamp = number & { __timestamp__: true };
export namespace DTimestamp {
  export const now = () => Date.now() as DTimestamp;
  export type Diff = number & { __diff__: true };

  export const diff = (t1: DTimestamp, t2: DTimestamp): Diff => {
    const t1Abs = Math.abs(t1);
    const t2Abs = Math.abs(t2);
    return Math.abs(t1Abs - t2Abs) as Diff;
  };

  export const diffNow = (t: DTimestamp): Diff => {
    return diff(t, now());
  };
}
