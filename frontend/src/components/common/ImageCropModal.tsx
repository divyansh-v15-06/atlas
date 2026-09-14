"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, X, Check, Loader2 } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => Promise<void> | void;
  outputWidth?: number;
  outputHeight?: number;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  outputWidth = 600,
  outputHeight = 600,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset controls when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setIsProcessing(false);
    }
  }, [isOpen, imageSrc]);

  // Handle Drag / Pan Events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Generate cropped output blob from canvas
  const handleSaveCrop = async () => {
    if (!imgRef.current || !containerRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      const img = imgRef.current;
      const containerSize = containerRef.current.clientWidth; // Usually 280-320px
      const scaleToOutput = outputWidth / containerSize;

      // Fill canvas background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Apply transformations centered in the canvas
      ctx.save();
      ctx.translate(outputWidth / 2, outputHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Determine dimensions maintaining aspect ratio
      const naturalAspect = img.naturalWidth / img.naturalHeight;
      let renderWidth = containerSize;
      let renderHeight = containerSize;

      if (naturalAspect > 1) {
        renderWidth = containerSize * naturalAspect;
      } else {
        renderHeight = containerSize / naturalAspect;
      }

      const drawX = (pan.x - containerSize / 2 + (containerSize - renderWidth) / 2) * scaleToOutput + (renderWidth * scaleToOutput) / 2;
      const drawY = (pan.y - containerSize / 2 + (containerSize - renderHeight) / 2) * scaleToOutput + (renderHeight * scaleToOutput) / 2;

      ctx.drawImage(
        img,
        -((renderWidth * scaleToOutput) / 2) + pan.x * scaleToOutput,
        -((renderHeight * scaleToOutput) / 2) + pan.y * scaleToOutput,
        renderWidth * scaleToOutput,
        renderHeight * scaleToOutput
      );
      ctx.restore();

      // Export canvas to Blob
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            await onCropComplete(blob);
          }
          setIsProcessing(false);
        },
        "image/jpeg",
        0.92
      );
    } catch (err) {
      console.error("Cropping error:", err);
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <Dialog isOpen={isOpen} onDismiss={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[1500] flex items-center justify-center p-4">
        <DialogContent
          aria-label="Crop Profile Photo"
          className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Crop Profile Picture</h3>
              <p className="text-xs text-gray-500">Drag to adjust position and use slider to zoom</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Crop Viewport */}
          <div className="p-6 flex flex-col items-center select-none">
            <div
              ref={containerRef}
              className="relative w-72 h-72 rounded-full overflow-hidden bg-gray-900 shadow-inner cursor-move border-4 border-dashed border-blue-400"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Image Container with Transforms */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                className="max-w-none absolute pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) rotate(${rotation}deg) scale(${zoom})`,
                  top: "50%",
                  left: "50%",
                  minWidth: "100%",
                  minHeight: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Center crosshair / guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                <div className="w-full h-[1px] bg-white" />
                <div className="h-full w-[1px] bg-white absolute" />
              </div>
            </div>

            {/* Controls Bar */}
            <div className="w-full mt-6 space-y-4">
              {/* Zoom Slider */}
              <div className="flex items-center gap-3">
                <ZoomOut className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <ZoomIn className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-xs font-mono font-medium text-gray-500 w-10 text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              {/* Utility Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Rotate 90°
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200/70 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSaveCrop}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving & Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save & Apply Photo
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
