"use client";

import { useEffect, useRef, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  code: string;
  title?: string;
  id?: string;
}

export default function MermaidViewer({ code, title, id = "diagram" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const renderChart = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            primaryColor: "#fcf8f6",
            primaryTextColor: "#33110e",
            primaryBorderColor: "#85261e",
            lineColor: "#85261e",
            secondaryColor: "#ffffff",
            tertiaryColor: "#f5ece7",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: "12px",
          },
          er: {
            useMaxWidth: false,
            layoutDirection: "TB",
            entityPadding: 16,
            stroke: "#85261e",
            fill: "#ffffff",
          },
        });

        const uniqueId = `mermaid-${id}-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, code);
        if (isMounted) {
          setSvgContent(svg);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          setError(err?.message || "Failed to render Mermaid diagram.");
          setLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [code, id]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Mermaid ER code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${id || "database-er-diagram"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SVG diagram downloaded!");
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className={`relative bg-white rounded-3xl border border-[#eedfd8] shadow-sm overflow-hidden flex flex-col transition-all ${
        isFullScreen ? "fixed inset-4 z-50 shadow-2xl" : "w-full"
      }`}
    >
      {/* Diagram Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eedfd8] px-4 py-3 bg-[#fff9f6]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#85261e] animate-pulse" />
          <h3 className="text-xs sm:text-sm font-bold text-[#33110e] uppercase tracking-wider">
            {title || "Entity-Relationship Model"}
          </h3>
          <span className="text-[11px] font-mono text-neutral-500 bg-white px-2 py-0.5 rounded-full border border-[#eedfd8]">
            Interactive SVG
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center border border-[#eedfd8] rounded-xl bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-[#eedfd8]/40 text-[#33110e] transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold px-2 text-neutral-600 border-x border-[#eedfd8]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-[#eedfd8]/40 text-[#33110e] transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-[#eedfd8]/40 text-[#33110e] transition border-l border-[#eedfd8]"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-xs font-semibold text-neutral-700 hover:text-[#85261e] transition shadow-2xs"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy Code"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-xs font-semibold text-neutral-700 hover:text-[#85261e] transition shadow-2xs"
            title="Export as Vector SVG"
          >
            <Download className="w-3.5 h-3.5 text-[#85261e]" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-neutral-700 hover:text-[#85261e] transition shadow-2xs"
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full ${
          isFullScreen ? "flex-1" : "h-[620px]"
        } overflow-hidden bg-[#faf8f6] cursor-grab active:cursor-grabbing select-none flex items-center justify-center p-6`}
        style={{
          backgroundImage: "radial-gradient(#eedfd8 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {loading && (
          <div className="flex flex-col items-center gap-3 text-neutral-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#85261e]" />
            <p className="text-xs font-semibold uppercase tracking-wider">Rendering Entity Relationships...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs">
            <p className="font-bold mb-1">Failed to render Mermaid diagram:</p>
            <p className="font-mono text-[11px] whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {!loading && !error && svgContent && (
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
            className="w-full h-full flex items-center justify-center pointer-events-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}

        {/* Pan tip pill */}
        <div className="absolute bottom-3 left-3 pointer-events-none bg-white/90 backdrop-blur-xs border border-[#eedfd8] px-3 py-1 rounded-full text-[10px] font-medium text-neutral-500 shadow-2xs">
          💡 Drag to pan • Scroll / use buttons to zoom
        </div>
      </div>
    </div>
  );
}
