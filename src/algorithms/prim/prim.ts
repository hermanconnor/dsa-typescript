import PriorityQueue from '../../data-structures/priority-queue/PriorityQueue';

interface Edge<T> {
  from: T;
  to: T;
  weight: number;
}

interface Neighbor<T> {
  to: T;
  weight: number;
}

interface PrimResult<T> {
  mst: Edge<T>[];
  totalWeight: number;
  isConnected: boolean;
  visited: Set<T>;
}

function prim<T>(graph: Map<T, Neighbor<T>[]>, start?: T): PrimResult<T> {}
