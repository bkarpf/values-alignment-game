import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import type { Value } from '../types/types';
import { ValueCard } from './ValueCard';

interface ValueSlotProps {
  value: Value | null;
  droppableId: string;
  placeholderText: string;
  children?: React.ReactNode;
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
  padding: 10px; /* Add padding */
`;

const PlaceholderText = styled.p`
  font-family: 'Inter', sans-serif;
  font-style: italic;
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  padding: 8px;
`;

// FIX: This wrapper will scale the card down to fit inside the slot
const SlottedCardWrapper = styled.div`
  transform: scale(0.85);
  transform-origin: center center;
  transition: transform 0.1s ease-in-out;
`;

export const ValueSlot: React.FC<ValueSlotProps> = ({ value, droppableId, placeholderText, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
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