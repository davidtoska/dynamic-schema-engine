export namespace DUtil {
  export const randomString = (length: number): string => {
    const letters = "abcdefghijklmnopqrstuvxyz";
    const uppercase = letters.toUpperCase();
    const all = letters + uppercase;
    const abs = Math.abs(length);
    let result = "";

    for (let i = 0; i < abs; i++) {
      const char = all.charAt(Math.floor(Math.random() * all.length));
      result += char;
    }
    return result;
  };

  export const neverCheck = (args: never) => {
    console.log("OOPS: This value slipped through the never-check", args);
  };

  export const isString = (str: unknown): str is string =>
    typeof str === "string";

  export const hasKey = <T extends string>(
    obj: unknown,
    key: T
  ): obj is Record<typeof key, unknown> => {
    if (!isRecord(obj)) {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  export const isRecord = (obj: unknown): obj is Record<string, unknown> => {
    if (!obj) {
      return false;
    }

    if (Array.isArray(obj)) {
      return false;
    }

    if (typeof obj !== "object") {
      return false;
    }

    if (obj === null) {
      return false;
    }
    return true;
  };

  export const isBool = (obj: boolean): obj is boolean =>
    typeof obj === "boolean";

  export const isTrue = (bool: boolean): bool is true => bool === true;

  export const isFalse = (bool: boolean): bool is false => bool === false;

  export const isDefined = (obj: unknown): boolean => {
    const notNull = obj !== null;
    const notUndefined = obj !== undefined;
    return notNull && notUndefined;
  };

  export const hasKind = (obj: unknown): obj is { readonly kind: string } => {
    if (!hasKey(obj, "kind")) {
      return false;
    }
    if (typeof obj.kind !== "string") {
      return false;
    }
    return obj.kind.length > 0;
  };

  export const hasValue = (obj: unknown): obj is { value: unknown } => {
    return hasKey(obj, "value");
  };
  export const isNumber = (value?: number): value is number => {
    const isNumber = typeof value === "number";
    const notNaN = !Number.isNaN(value);
    return isNumber && notNaN;
  };

  export const maxFn = (upperLimit: number) => {
    return (value: number) => {
      return Math.min(value, upperLimit);
    };
  };

  export const minFn = (lowerLimit: number) => {
    return (value: number) => {
      return Math.min(value, lowerLimit);
    };
  };
}
