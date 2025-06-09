import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { CanvasCard } from '../types';
import { ValueCard } from './ValueCard';

// Props definition based on Section 4.5
interface FreeCanvasProps {
  values: CanvasCard[];
  onCardMove: (instanceId: string, newPosition: { x: number; y: number }) => void;
}

// Styled components implementing presentation from Sections 4.5 & 7.1.1
const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFFFFF; /* Interactive Surface */
  border: 1px solid #DEE2E6;
  border-radius: 8px;
  overflow: hidden; /* Important for zoom/pan component */
  position: relative;
`;

const CanvasContent = styled.div`
  width: 2000px; /* Define a large inner canvas size */
  height: 2000px;
  position: relative;
`;

export const FreeCanvas: React.FC<FreeCanvasProps> = ({ values, onCardMove }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // Create a ref for the Draggable node to avoid findDOMNode warnings in React 18 Strict Mode
  const nodeRef = useRef(null);

  return (
    <CanvasWrapper>
      <TransformWrapper>
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          <CanvasContent>
            {values.map(card => (
              <Draggable
                key={card.instanceId}
                nodeRef={nodeRef} // Pass the ref here
                handle=".handle" // Use a class to define the drag handle area
                position={card.position}
                onStart={() => setDraggingId(card.instanceId)}
                onStop={(_e, data) => {
                  setDraggingId(null);
                  onCardMove(card.instanceId, { x: data.x, y: data.y });
                }}
              >
                {/* The div is the draggable node. Apply z-index and ref here. */}
                <div
                  ref={nodeRef}
                  className="handle" // The entire card is the handle
                  style={{
                    position: 'absolute',
                    zIndex: draggingId === card.instanceId ? 1000 : 1, // Requirement 4.5
                    width: card.size.width,
                    height: card.size.height,
                  }}
                >
                  <ValueCard
                    value={card.value}
                    isDragging={draggingId === card.instanceId}
                    color={card.isCore ? '#FFFFFF' : '#E6F7FF'}
                  />
                </div>
              </Draggable>
            ))}
          </CanvasContent>
        </TransformComponent>
      </TransformWrapper>
    </CanvasWrapper>
  );
};
