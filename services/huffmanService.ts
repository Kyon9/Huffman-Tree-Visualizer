
import { HTNode, AlgorithmPhase, AnimationStep, InputItem } from '../types';
import { CODE_SECTION_RANGES } from '../constants';

export function generateAnimationSteps(input: InputItem[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = input.length;
  const m = 2 * n - 1;
  const nodes: HTNode[] = [];

  // Step 1: Initialization
  for (let i = 0; i < n; i++) {
    nodes[i + 1] = {
      id: i + 1,
      ch: input[i].ch,
      weight: input[i].weight,
      parent: 0,
      lchild: 0,
      rchild: 0,
      isLeaf: true,
    };
  }
  for (let i = n + 1; i <= m; i++) {
    nodes[i] = {
      id: i,
      ch: '',
      weight: 0,
      parent: 0,
      lchild: 0,
      rchild: 0,
      isLeaf: false,
    };
  }

  const getCleanNodes = () => JSON.parse(JSON.stringify(nodes.filter(n => n)));

  steps.push({
    phase: AlgorithmPhase.INITIALIZATION,
    description: '初始化哈夫曼树结点，填入叶子结点的字符和权值。',
    highlightNodes: Array.from({ length: n }, (_, i) => i + 1),
    nodes: getCleanNodes(),
    codeLineRange: CODE_SECTION_RANGES.CREATE,
  });

  // Step 2: Construction
  for (let i = n + 1; i <= m; i++) {
    // Select
    let s1 = -1, s2 = -1;
    let min1 = Infinity, min2 = Infinity;

    // Simulation of selection for animation
    const candidates = [];
    for (let j = 1; j < i; j++) {
      if (nodes[j] && nodes[j].parent === 0) candidates.push(j);
    }

    steps.push({
      phase: AlgorithmPhase.SELECTION,
      description: `查找当前 ${i} 之前未被使用的两个权值最小的结点。`,
      highlightNodes: candidates,
      nodes: getCleanNodes(),
      codeLineRange: CODE_SECTION_RANGES.SELECT,
    });

    for (let j = 1; j < i; j++) {
      if (nodes[j] && nodes[j].parent === 0) {
        if (nodes[j].weight < min1) {
          min2 = min1;
          s2 = s1;
          min1 = nodes[j].weight;
          s1 = j;
        } else if (nodes[j].weight < min2) {
          min2 = nodes[j].weight;
          s2 = j;
        }
      }
    }

    // Merge
    if (s1 !== -1 && s2 !== -1) {
      nodes[s1].parent = i;
      nodes[s2].parent = i;
      nodes[i].lchild = s1;
      nodes[i].rchild = s2;
      nodes[i].weight = nodes[s1].weight + nodes[s2].weight;

      steps.push({
        phase: AlgorithmPhase.MERGING,
        description: `合并结点 ${nodes[s1].ch || s1} (${nodes[s1].weight}) 和 ${nodes[s2].ch || s2} (${nodes[s2].weight})，父节点为 ${i}。`,
        highlightNodes: [s1, s2, i],
        nodes: getCleanNodes(),
        codeLineRange: CODE_SECTION_RANGES.CREATE,
      });
    }
  }

  // Step 3: Coding
  const codes: Record<string, string> = {};
  for (let i = 1; i <= n; i++) {
    let code = '';
    let c = i;
    let f = nodes[i].parent;

    steps.push({
      phase: AlgorithmPhase.CODING,
      description: `开始生成字符 ${nodes[i].ch} 的哈夫曼编码。`,
      highlightNodes: [i],
      nodes: getCleanNodes(),
      codeLineRange: CODE_SECTION_RANGES.CODING,
      activeLeafId: i,
      currentPathNodeId: i
    });

    while (f !== 0) {
      const bit = nodes[f].lchild === c ? '0' : '1';
      code = bit + code;
      
      steps.push({
        phase: AlgorithmPhase.CODING,
        description: `从结点 ${c} 向上回溯到父节点 ${f}，经过 ${bit === '0' ? '左' : '右'}孩子，编码追加 '${bit}'。`,
        highlightNodes: [c, f],
        nodes: getCleanNodes(),
        codeLineRange: CODE_SECTION_RANGES.CODING,
        activeLeafId: i,
        currentPathNodeId: f
      });

      c = f;
      f = nodes[f].parent;
    }
    codes[nodes[i].ch] = code;

    steps.push({
      phase: AlgorithmPhase.CODING,
      description: `字符 ${nodes[i].ch} 编码完成：${code}`,
      highlightNodes: [i],
      nodes: getCleanNodes(),
      codeLineRange: CODE_SECTION_RANGES.CODING,
      activeLeafId: i,
      huffmanCodes: { ...codes }
    });
  }

  return steps;
}
