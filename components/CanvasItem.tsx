import React, { useState, useEffect, useRef } from 'react';
import { CanvasItem as CanvasItemProps, CanvasItemType, Product, Invoice } from '../types';
import { SpinnerIcon } from './icons';

interface CanvasItemComponentProps {
  item: CanvasItemProps;
  isDragging: boolean;
  onDragStart: (id: string, e: React.MouseEvent) => void;
}


const CanvasItem: React.FC<CanvasItemComponentProps> = ({ item, isDragging, onDragStart }) => {
  const [animatedSvgContent, setAnimatedSvgContent] = useState<string | null>(null);
  // FIX: Initialize useRef with null to satisfy the requirement of providing an initial value.
  const prevContentRef = useRef<any>(null);

  useEffect(() => {
    // Reset animation if content changes
    if (item.type === CanvasItemType.ROOM_PLAN && prevContentRef.current !== item.content) {
      setAnimatedSvgContent(null);
    }
    prevContentRef.current = item.content;
  }, [item.content, item.type]);
  
  useEffect(() => {
    if (item.type === CanvasItemType.ROOM_PLAN && item.content && !animatedSvgContent && item.status === 'complete') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.content;

        const svg = tempDiv.querySelector('svg');
        if (!svg) return;

        const paths = Array.from(svg.querySelectorAll('path, rect, circle, line, polyline, polygon'));
        if (paths.length === 0) {
            setAnimatedSvgContent(item.content); // No paths, just set as is
            return;
        }

        const styleEl = document.createElement('style');
        styleEl.textContent = `@keyframes draw { to { stroke-dashoffset: 0; } }`;
        svg.prepend(styleEl);

        let animationDelay = 0;
        paths.forEach((path) => {
            const el = path as SVGGeometryElement;
            if (typeof el.getTotalLength === 'function') {
                const length = el.getTotalLength();
                if (length > 0) {
                    el.style.strokeDasharray = String(length);
                    el.style.strokeDashoffset = String(length);
                    const duration = Math.max(0.4, length / 400); // Speed based on length
                    el.style.animation = `draw ${duration.toFixed(2)}s ease-out ${animationDelay.toFixed(2)}s forwards`;
                    animationDelay += duration * 0.3; // Stagger start of next animation
                }
            }
        });

        setAnimatedSvgContent(tempDiv.innerHTML);
    }
}, [item.content, item.type, item.status, animatedSvgContent]);

  if (item.status === 'pending') {
    return (
      <div
        className="absolute glass-effect-light border-2 border-dashed border-indigo-400/50 rounded-lg shadow-xl flex flex-col items-center justify-center transition-all duration-100 ease-in-out z-20 p-4"
        style={{ left: item.x, top: item.y, width: item.width, height: item.height }}
      >
        <SpinnerIcon />
        <span className="mt-2 text-sm text-gray-300 text-center text-shadow">{item.title}</span>
      </div>
    );
  }

  const renderContent = () => {
    switch (item.type) {
      case CanvasItemType.MOODBOARD:
        return (
          <div className="grid grid-cols-2 gap-1 p-1 h-full">
            {(item.content as string[]).map((src, index) => (
              <img key={index} src={src} alt={`moodboard-img-${index}`} className="w-full h-full object-cover rounded-md" />
            ))}
          </div>
        );
      case CanvasItemType.ROOM_PLAN:
        return (
          <div 
            className="p-2 h-full w-full bg-white rounded-md flex items-center justify-center overflow-hidden" 
            dangerouslySetInnerHTML={{ __html: animatedSvgContent || '' }} 
          />
        );
      case CanvasItemType.PRODUCT_SUGGESTION:
        return (
          <div className="p-4 space-y-3 overflow-y-auto h-full">
            {(item.content as Product[]).map((product, index) => (
              <div key={index} className="border-b border-white/10 pb-2 last:border-b-0">
                <h4 className="font-bold text-sm text-white">{product.name} - {product.price}</h4>
                <p className="text-xs text-gray-300">{product.description}</p>
              </div>
            ))}
          </div>
        );
      case CanvasItemType.INVOICE:
          const invoice = item.content as Invoice;
          return (
              <div className="p-4 text-sm text-gray-300 overflow-y-auto h-full">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="border-b border-white/20">
                              <th className="pb-1 font-semibold">Item</th>
                              <th className="pb-1 text-center font-semibold">Qty</th>
                              <th className="pb-1 text-right font-semibold">Price</th>
                              <th className="pb-1 text-right font-semibold">Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          {invoice.items.map((it, i) => (
                              <tr key={i} className="border-b border-white/10">
                                  <td className="py-1">{it.description}</td>
                                  <td className="py-1 text-center">{it.quantity}</td>
                                  <td className="py-1 text-right">${it.unitPrice.toFixed(2)}</td>
                                  <td className="py-1 text-right">${it.total.toFixed(2)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="mt-4 pt-2 border-t border-white/20 text-right space-y-1">
                      <p>Subtotal: <span className="font-medium">${invoice.subtotal.toFixed(2)}</span></p>
                      <p>Tax: <span className="font-medium">${invoice.tax.toFixed(2)}</span></p>
                      <p className="font-bold text-base text-white">Total: <span className="font-bold">${invoice.total.toFixed(2)}</span></p>
                  </div>
              </div>
          );
      case CanvasItemType.LOOK:
        return <img src={item.content as string} alt="fashion look" className="w-full h-full object-cover" />;
      case CanvasItemType.COLOR_PALETTE:
        return (
          <div className="flex h-full overflow-hidden rounded-b-lg">
            {(item.content as string[]).map((color, index) => (
              <div key={index} style={{ backgroundColor: color }} className="flex-1" title={color} />
            ))}
          </div>
        );
      default:
        return <div className="p-4">Unknown item type</div>;
    }
  };

  return (
    <div
      className={`absolute glass-effect-light rounded-lg flex flex-col transition-all duration-200 ease-in-out shadow-lg shadow-black/30 ${isDragging ? 'shadow-[0_0_30px_8px_rgba(99,102,241,0.6)] z-30 scale-105' : 'z-20'}`}
      style={{ left: item.x, top: item.y, width: item.width, height: item.height }}
    >
      <div
        className={`h-8 bg-black/30 backdrop-blur-sm flex items-center px-3 flex-shrink-0 rounded-t-lg border-b border-white/10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={(e) => onDragStart(item.id, e)}
      >
        <span className="font-bold text-sm text-gray-200 truncate select-none text-shadow" title={item.title}>{item.title}</span>
      </div>
      <div className="flex-grow relative bg-gray-800/80 rounded-b-lg overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default CanvasItem;
