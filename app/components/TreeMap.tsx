"use client";

import { useRef, useState, useEffect } from "react";
import type { TreeMapNode } from "@/lib/types";
import { cn, formatCompact } from "@/lib/utils";
import { TreeMapTooltip } from "./TreeMapTooltip";

interface TreeMapProps {
  nodes: TreeMapNode[];
  originalWidth?: number;
  originalHeight?: number;
  focusedFund?: string | null;
  onFocusFund?: (symbol: string | null) => void;
}

export function TreeMap({
  nodes,
  originalWidth = 1200,
  originalHeight = 400,
  focusedFund,
  onFocusFund,
}: TreeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(originalWidth);
  const [hoveredNode, setHoveredNode] = useState<TreeMapNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scaleX = containerWidth / originalWidth;
  const scaleY = scaleX;
  const scaledHeight = originalHeight * scaleY;

  // Find the focused fund's parent node and compute zoom transform
  const focusedParent = focusedFund
    ? nodes.find(
        (n) =>
          n.depth === 1 &&
          n.symbol === focusedFund &&
          nodes.some((c) => c.parentSymbol === n.symbol)
      )
    : null;

  // Compute zoom: scale focused fund's bounding box to fill entire container
  let zoomTransform: {
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
  } | null = null;

  if (focusedParent) {
    const fw = (focusedParent.x1 - focusedParent.x0) * scaleX;
    const fh = (focusedParent.y1 - focusedParent.y0) * scaleY;
    const fx = focusedParent.x0 * scaleX;
    const fy = focusedParent.y0 * scaleY;

    if (fw > 0 && fh > 0) {
      zoomTransform = {
        scaleX: containerWidth / fw,
        scaleY: scaledHeight / fh,
        offsetX: -fx * (containerWidth / fw),
        offsetY: -fy * (scaledHeight / fh),
      };
    }
  }

  // Separate parent (depth 1 with children) and leaf nodes
  const parentNodes = nodes.filter(
    (n) => n.depth === 1 && nodes.some((c) => c.parentSymbol === n.symbol)
  );
  const leafNodes = nodes.filter((n) => {
    if (n.depth === 1 && !nodes.some((c) => c.parentSymbol === n.symbol))
      return true;
    if (n.depth === 2) return true;
    return false;
  });

  function handleMouseMove(e: React.MouseEvent) {
    setMousePos({ x: e.clientX, y: e.clientY });
  }

  function handleNodeClick(node: TreeMapNode) {
    if (!onFocusFund) return;

    if (node.depth === 1 && nodes.some((c) => c.parentSymbol === node.symbol)) {
      // Click on a fund group
      onFocusFund(focusedFund === node.symbol ? null : node.symbol);
    } else if (node.depth === 2 && node.parentSymbol) {
      // Click on a holding within a fund — focus the parent fund
      onFocusFund(
        focusedFund === node.parentSymbol ? null : node.parentSymbol
      );
    }
  }

  function handleContainerClick(e: React.MouseEvent) {
    // Only unfocus if clicking directly on the container background
    if (e.target === containerRef.current && focusedFund && onFocusFund) {
      onFocusFund(null);
    }
  }

  if (nodes.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted">
        Loading treemap...
      </div>
    );
  }

  function getTransformedPos(x: number, y: number, w: number, h: number) {
    if (!zoomTransform) return { left: x, top: y, width: w, height: h };
    return {
      left: x * zoomTransform.scaleX + zoomTransform.offsetX,
      top: y * zoomTransform.scaleY + zoomTransform.offsetY,
      width: w * zoomTransform.scaleX,
      height: h * zoomTransform.scaleY,
    };
  }

  function isNodeVisible(node: TreeMapNode): boolean {
    if (!focusedFund) return true;
    // When focused: show only the focused fund's parent + its children
    if (node.depth === 1 && node.symbol === focusedFund) return true;
    if (node.depth === 2 && node.parentSymbol === focusedFund) return true;
    return false;
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl bg-surface border border-border/60 shadow-[var(--shadow-md)] cursor-default"
        style={{ height: scaledHeight }}
        onMouseMove={handleMouseMove}
        onClick={handleContainerClick}
      >
        {/* Parent group backgrounds */}
        {parentNodes.map((node) => {
          const visible = isNodeVisible(node);
          const rawPos = {
            x: node.x0 * scaleX,
            y: node.y0 * scaleY,
            w: (node.x1 - node.x0) * scaleX,
            h: (node.y1 - node.y0) * scaleY,
          };
          const pos = getTransformedPos(rawPos.x, rawPos.y, rawPos.w, rawPos.h);

          return (
            <div
              key={`group-${node.id}`}
              className={cn(
                "absolute rounded-lg",
                "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              )}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
                backgroundColor: `${node.color}15`,
                border: `1px solid ${node.color}30`,
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node);
              }}
            >
              <span
                className="absolute top-0.5 left-1.5 text-[10px] font-semibold truncate opacity-70 transition-opacity duration-300"
                style={{
                  color: node.color,
                  maxWidth: pos.width - 8,
                }}
              >
                {node.symbol}
              </span>
            </div>
          );
        })}

        {/* Leaf nodes (interactive) */}
        {leafNodes.map((node) => {
          const visible = isNodeVisible(node);
          const rawPos = {
            x: node.x0 * scaleX,
            y: node.y0 * scaleY,
            w: (node.x1 - node.x0) * scaleX,
            h: (node.y1 - node.y0) * scaleY,
          };
          const pos = getTransformedPos(rawPos.x, rawPos.y, rawPos.w, rawPos.h);
          const w = pos.width;
          const h = pos.height;
          const showSymbol = visible && w > 45 && h > 25;
          const showValue = visible && w > 75 && h > 40;

          return (
            <div
              key={node.id}
              className={cn(
                "absolute rounded-lg flex flex-col items-center justify-center",
                "cursor-pointer select-none overflow-hidden",
                "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                visible &&
                  "hover:z-20 hover:brightness-110 hover:shadow-[var(--shadow-lg)]"
              )}
              style={{
                left: pos.left,
                top: pos.top,
                width: w,
                height: h,
                backgroundColor: node.color,
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.85)",
                pointerEvents: visible ? "auto" : "none",
                boxShadow: visible
                  ? "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.06)"
                  : "none",
                border: visible ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
              onMouseEnter={() => visible && setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node);
              }}
            >
              {showSymbol && (
                <span className="text-white font-bold text-xs drop-shadow-sm leading-none">
                  {node.symbol}
                </span>
              )}
              {showValue && (
                <span className="text-white/80 text-[10px] mt-0.5 drop-shadow-sm leading-none">
                  {formatCompact(node.value)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <TreeMapTooltip
        node={hoveredNode}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
      />
    </div>
  );
}
