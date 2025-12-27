
export interface HTNode {
  id: number;
  ch: string;
  weight: number;
  parent: number;
  lchild: number;
  rchild: number;
  isLeaf: boolean;
  x?: number;
  y?: number;
}

export enum AlgorithmPhase {
  INITIALIZATION = 'INITIALIZATION',
  SELECTION = 'SELECTION',
  MERGING = 'MERGING',
  CODING = 'CODING',
  IDLE = 'IDLE'
}

export interface AnimationStep {
  phase: AlgorithmPhase;
  description: string;
  highlightNodes: number[];
  nodes: HTNode[];
  codeLineRange: [number, number]; // [startLine, endLine]
  activeLeafId?: number;
  currentPathNodeId?: number;
  huffmanCodes?: Record<string, string>;
}

export interface InputItem {
  ch: string;
  weight: number;
}
