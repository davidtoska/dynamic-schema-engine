export type Fact = Fact.Numeric | Fact.String;
export namespace Fact {
  export type Kind = 'string-fact' | 'numeric-fact';

  export interface Numeric {
    readonly kind: 'numeric-fact';
    readonly value: number;
    readonly label: string;
    readonly referenceId: string;
    readonly referenceLabel: string;
  }

  export interface String {
    readonly kind: 'string-fact';
    readonly label: string;
    readonly value: string;
    readonly referenceId: string;
    readonly referenceLabel: string;
  }
}
