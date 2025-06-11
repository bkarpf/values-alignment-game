import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import type { Value } from '../types/types';
import { ValueCard } from './ValueCard';

// Add the 'data' prop to the interface
interface ValueSlotProps {
  value: Value | null;
  droppableId: string;
  placeholderText: string;
  children?: React.ReactNode;
  data?: Record<string, unknown>; 
}

const SlotContainer = styled.div<{ $isOver: boolean; $isEmpty: boolean }>`
  box-sizing: border-box;
  width: 170px;
  height: 120px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
  border: 2px solid ${({ $isOver, $isEmpty }) => ($isOver && $isEmpty) ? '#007AFF' : '#DEE2E6'};
  border-style: ${({ $isOver, $isEmpty }) => ($isOver && $isEmpty) ? 'dashed' : 'solid'};
  transition: border-color 0.2s ease-in-out, border-style 0.2s ease-in-out;
  flex-shrink: 0;
  padding: 10px;
`;

const PlaceholderText = styled.p`
  font-family: 'Inter', sans-serif;
  font-style: italic;
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  padding: 8px;
`;

const SlottedCardWrapper = styled.div`
  transform: scale(0.85);
  transform-origin: center center;
`;

export const ValueSlot: React.FC<ValueSlotProps> = ({ value, droppableId, placeholderText, children, data }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data, // Pass the data to the hook
  });

  return (
    <SlotContainer ref={setNodeRef} $isOver={isOver} $isEmpty={!value && !children}>
      {children ? (
        <SlottedCardWrapper>{children}</SlottedCardWrapper>
      ) : value ? (
        <SlottedCardWrapper><ValueCard value={value} /></SlottedCardWrapper>
      ) : (
        <PlaceholderText>{placeholderText}</PlaceholderText>
      )}
    </SlotContainer>
  );
};