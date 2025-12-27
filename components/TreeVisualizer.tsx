
import React, { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { HTNode, AnimationStep } from '../types';

interface TreeVisualizerProps {
  step: AnimationStep;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ step }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hierarchyData = useMemo(() => {
    const nodes = step.nodes.filter(n => n !== null && n !== undefined);
    if (nodes.length === 0) return null;

    const rootNode = nodes.reduce((prev, curr) => (curr.parent === 0 && curr.weight > 0 ? curr : prev), null as HTNode | null);
    if (!rootNode) return null;
    
    const buildHierarchy = (nodeId: number): any => {
      const node = nodes.find(n => n && n.id === nodeId);
      if (!node) return null;
      const children = [];
      if (node.lchild) {
        const left = buildHierarchy(node.lchild);
        if (left) children.push(left);
      }
      if (node.rchild) {
        const right = buildHierarchy(node.rchild);
        if (right) children.push(right);
      }
      return {
        ...node,
        name: node.ch || `Sum: ${node.weight}`,
        children: children.length > 0 ? children : null
      };
    };

    return buildHierarchy(rootNode.id);
  }, [step]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !hierarchyData) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tree = d3.tree().size([width, height]);
    const root = d3.hierarchy(hierarchyData);
    const treeData = tree(root);

    const activeNodes = step.nodes.filter(n => n !== null && n !== undefined);

    // Links
    g.selectAll(".link")
      .data(treeData.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d: any) => {
          if (step.activeLeafId) {
             const pathNodeIds = [];
             let curr: number | undefined = step.currentPathNodeId;
             while(curr) {
                 pathNodeIds.push(curr);
                 const node = activeNodes.find(n => n.id === curr);
                 curr = node?.parent;
                 if (curr === 0) curr = undefined;
             }
             if (pathNodeIds.includes(d.source.data.id) && pathNodeIds.includes(d.target.data.id)) {
                 return "#10b981"; 
             }
          }
          return "#334155";
      })
      .attr("stroke-width", 2)
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y) as any
      );

    // Labels on links (0 / 1)
    g.selectAll(".link-label")
      .data(treeData.links())
      .enter().append("text")
      .attr("font-size", "10px")
      .attr("fill", "#64748b")
      .attr("font-family", "Fira Code")
      .attr("text-anchor", "middle")
      .attr("x", (d: any) => (d.source.x + d.target.x) / 2 + (d.source.x < d.target.x ? 8 : -8))
      .attr("y", (d: any) => (d.source.y + d.target.y) / 2)
      .text((d: any) => d.source.data.lchild === d.target.data.id ? "0" : "1");

    // Nodes
    const nodesGroup = g.selectAll(".node")
      .data(treeData.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    nodesGroup.append("circle")
      .attr("r", 16)
      .attr("fill", (d: any) => {
        if (step.highlightNodes.includes(d.data.id)) return "#2563eb";
        if (step.activeLeafId === d.data.id) return "#059669";
        return d.data.isLeaf ? "#1e293b" : "#334155";
      })
      .attr("stroke", (d: any) => {
        if (step.highlightNodes.includes(d.data.id)) return "#60a5fa";
        if (step.activeLeafId === d.data.id) return "#34d399";
        return "#475569";
      })
      .attr("stroke-width", 1.5);

    nodesGroup.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .text((d: any) => d.data.ch || d.data.weight);

    nodesGroup.append("text")
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", "#475569")
      .attr("font-size", "9px")
      .attr("font-weight", "500")
      .text((d: any) => d.data.ch ? `w:${d.data.weight}` : `id:${d.data.id}`);

  }, [hierarchyData, step]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center bg-slate-950/20">
      {!hierarchyData && (
        <div className="flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-50">
           <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a4 4 0 01-2.574.345l-3.113-.623a4 4 0 01-2.574-.345l-.675-.337a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547V21a1 1 0 001.145.992l2.387-.477a4 4 0 012.574-.345l3.113.623a4 4 0 012.574.345l.675.337a6 6 0 003.86.517l2.387-.477A1 1 0 0019.428 21v-5.572z" />
           </svg>
           <p className="text-[11px] uppercase tracking-widest font-bold">Waiting for Root...</p>
        </div>
      )}
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      ></svg>
    </div>
  );
};

export default TreeVisualizer;
