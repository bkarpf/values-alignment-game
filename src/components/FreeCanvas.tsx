import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface FreeCanvasProps {
  children: React.ReactNode;
}

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const CanvasContent = styled.div`
  width: 2000px;
  height: 2000px;
  position: relative;
`;

// Use forwardRef to pass the ref to the TransformWrapper
export const FreeCanvas = forwardRef<ReactZoomPanPinchRef, FreeCanvasProps>(
  ({ children }, ref) => {
    return (
      <CanvasWrapper>
        <TransformWrapper
          ref={ref}
          panning={{
            // FIX: Pass only the class name, not the selector, to fix the crash.
            excluded: ['dnd-draggable'],
          }}
          minScale={0.2}
          maxScale={2}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%' }}
          >
            <CanvasContent>
              {children}
            </CanvasContent>
          </TransformComponent>
        </TransformWrapper>
      </CanvasWrapper>
    );
  }
);

// Add a display name for better debugging in React DevTools
FreeCanvas.displayName = 'FreeCanvas';