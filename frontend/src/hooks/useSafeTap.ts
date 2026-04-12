import { useRef, useState, useCallback } from 'react';

interface SafeTapProps {
  onTap: () => void;
  disabled?: boolean;
  threshold?: number;
  timeThreshold?: number;
}

export const useSafeTap = ({ onTap, disabled = false, threshold = 10, timeThreshold = 300 }: SafeTapProps) => {
  const touchStart = useRef<{ x: number, y: number, time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  }, [disabled]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || disabled) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaTime = Date.now() - touchStart.current.time;
    const deltaX = Math.abs(endX - touchStart.current.x);
    const deltaY = Math.abs(endY - touchStart.current.y);

    // If movement is small AND time is short, it's a tap, not a swipe
    if (deltaX < threshold && deltaY < threshold && deltaTime < timeThreshold) {
      e.preventDefault(); // Prevent ghost click
      onTap();
    }
    touchStart.current = null;
  }, [onTap, disabled, threshold, timeThreshold]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Block Radix's default pointerdown behavior on touch to prevent immediate trigger on many primitives
    if (e.pointerType === 'touch' && !disabled) {
      e.preventDefault();
    }
  }, [disabled]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only handle real mouse clicks (non-touch) here
    // In most modern browsers, nativeEvent is MouseEvent and not a PointerEvent for real mouse clicks
    if (!(e.nativeEvent instanceof PointerEvent && (e.nativeEvent as any).pointerType === 'touch') && !disabled) {
      onTap();
    }
  }, [onTap, disabled]);

  return {
    handleTouchStart,
    handleTouchEnd,
    handlePointerDown,
    handleClick,
    touchProps: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onPointerDown: handlePointerDown,
      onClick: handleClick
    }
  };
};
