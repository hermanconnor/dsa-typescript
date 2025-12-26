export interface Edge<T> {
  from: T;
  to: T;
  weight: number;
}

interface BellmanFordResult<T> {
  distances: Map<T, number>;
  previous: Map<T, T | null>;
  hasNegativeCycle: boolean;
  negativeCycleNodes?: Set<T>;
}

export function bellmanFord<T>(): BellmanFordResult<T> {}
