import clsx from "clsx";
import * as d3 from "d3";
import { useMemo, useRef, useState } from "react";

export type Tree = {
  id: string;
  value: boolean;
  type: "ENDPOINT" | "APPLICATION" | "SERVICE";
  children?: Tree[];
  // Only available in tree map made by createTreeMap
  parent?: string;
};

type TreeDict = {
  id: Tree["id"];
  value: Tree["value"];
  type: Tree["type"];
  children?: string[];
  parent?: string;
};

const MARGIN = { top: 60, right: 100, bottom: 60, left: 100 };
const NODE_HEIGHT = 50;
const NODE_WIDTH = 150;
//   id: "web",
//   value: false,
//   type: "application",
//   children: [
//     {
//       id: "web/gateway",
//       value: false,
//       type: "service",
//       children: [{ id: "web/gateway/api", value: false, type: "endpoint" }],
//     },

//     {
//       id: "web/frontend",
//       value: false,
//       type: "service",
//       children: [{ id: "web/frontend/http", value: false, type: "service" }],
//     },
//   ],
// };

export type ApplicationDependencyGraph = {
  nodes: {
    id: string;
    value: boolean;
    type: Tree["type"];
  }[];
  edges: { from: string; to: string }[];
};

export function DependencyTree({
  width = 700,
  height = 500,
  trees,
}: {
  width?: number;
  height?: number;
  trees: Tree[];
}) {
  const svgRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [activeTree, setActiveTree] = useState(trees[0]);

  const root = useMemo(() => {
    return d3.hierarchy(activeTree);
  }, [activeTree]);

  const cluster = useMemo(() => {
    const clusterGenerator = d3
      .cluster<Tree>()
      .size([boundsHeight, boundsWidth]);
    return clusterGenerator(root);
  }, [root, boundsWidth, boundsHeight]);

  const allNodes = cluster.descendants().map((node) => {
    return (
      <TreeNode key={node.id} node={node} active={false} onClick={() => ({})} />
    );
  });

  const allEdges = cluster.descendants().map((node) => {
    return <TreePath key={node.id} node={node} />;
  });

  return (
    <>
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="flex flex-col gap-4">
          <TreeNavigator
            trees={trees}
            activeTree={activeTree}
            onActiveTreeChange={(tree) => setActiveTree(tree)}
          />
        </div>
        <div className="flex justify-center bg-gray-200">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="bg-gray-200"
          >
            <g
              width={boundsWidth}
              height={boundsHeight}
              transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
              overflow="scroll"
            >
              {allEdges}
              {allNodes}
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}

function TreeNavigator({
  trees,
  activeTree,
  onActiveTreeChange,
}: {
  trees: Tree[];
  activeTree: Tree;
  onActiveTreeChange: (tree: Tree) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider opacity-70">
          Applications
        </span>
        <div>
          {trees.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onActiveTreeChange(t)}
            >
              <span className={clsx(activeTree.id === t.id && "font-semibold")}>
                {t.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TreeNode({
  active,
  node,
  onClick,
}: {
  active: boolean;
  node: d3.HierarchyPointNode<Tree>;
  onClick: () => void;
}) {
  return (
    <g onClick={onClick}>
      <rect
        x={node.y - NODE_WIDTH / 2}
        y={node.x - NODE_HEIGHT / 2}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        fill={active ? "#5C7BE9" : "#fff"}
        rx={10}
      />

      <g>
        <text
          x={node.y + 10 - NODE_WIDTH / 2}
          y={node.x - 4}
          fontSize={13}
          textAnchor="left"
          alignmentBaseline="middle"
          fill={active ? "#fff" : ""}
        >
          {node.data.id}
        </text>
        <text
          x={node.y + 10 - NODE_WIDTH / 2}
          y={node.x + 12}
          fontSize={10}
          opacity={0.6}
          textAnchor="left"
          alignmentBaseline="middle"
          fill={active ? "#fff" : ""}
        >
          {node.data.type}
        </text>
      </g>
    </g>
  );
}

function TreePath({ node }: { node: d3.HierarchyPointNode<Tree> }) {
  if (!node.parent) {
    return;
  }

  return (
    <>
      <defs>
        <marker
          id="diamond-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto-start-reverse"
          viewBox="0 0 10 10"
          markerUnits="strokeWidth"
        >
          <path d="M0,5 L5,0 L10,5 L5,10 Z" fill="grey" />
        </marker>

        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="3"
          viewBox="0 0 10 10"
          orient="auto-start-reverse"
          // markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="grey" />
        </marker>
      </defs>

      {/* <line
        x1={node.parent.y + NODE_WIDTH / 2 + 5}
        y1={node.parent.x}
        x2={node.y - NODE_WIDTH / 2 - 10}
        y2={node.x}
        stroke="black"
        markerStart="url(#diamond-arrow)"
        marker-end="url(#arrow)"
      /> */}

      <path
        fill="none"
        stroke="grey"
        strokeDasharray="4,4"
        markerStart="url(#diamond-arrow)"
        markerEnd="url(#arrow)"
        d={
          d3.linkHorizontal()({
            source: [node.parent.y + NODE_WIDTH / 2 + 5, node.parent.x],
            target: [node.y - NODE_WIDTH / 2 - 10, node.x],
          }) ?? undefined
        }
      />
    </>
  );
}
