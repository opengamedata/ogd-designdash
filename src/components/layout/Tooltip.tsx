import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Tooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showTooltip && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 8, // Position above the element with small gap
        left: rect.left + rect.width / 2, // Center horizontally on the trigger element
      });
    }
  }, [showTooltip]);

  const tooltipElement = showTooltip && (
    <div
      className="fixed px-3 py-2 bg-gray-900 text-white text-xs rounded-lg pointer-events-none whitespace-wrap z-[9999] max-w-sm shadow-lg"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        transform: 'translateX(10px)',
      }}
    >
      {text}
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
}

export default Tooltip;
