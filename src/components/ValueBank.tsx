import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import type { Value } from '../types/types';
import { ValueCard } from './ValueCard';

interface ValueBankProps {
  title: string;
  values: Value[];
  droppableId: string;
  children?: React.ReactNode;
}

const SortableValueCard = ({ value }: { value: Value }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: value.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 100 : 'auto' };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ValueCard value={value} isDragging={isDragging} />
    </div>
  );
};

// Use the transient prop '$isOver'
const BankContainer = styled.div<{ $isOver: boolean }>`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  background-color: ${({ $isOver }) => $isOver ? '#E6F7FF' : '#F8F9FA'};
  border: 1px solid #DEE2E6;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out;
  flex-shrink: 0;
`;

const BankTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 20px;
  padding: 16px;
  border-bottom: 1px solid #DEE2E6;
  margin: 0;
`;

const CardList = styled.div`
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
`;

export const ValueBank: React.FC<ValueBankProps> = ({ title, values, droppableId, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
  });

  const valueIds = values.map(v => v.id);

  return (
    // Pass the transient prop to the styled component
    <BankContainer ref={setNodeRef} $isOver={isOver}>
      <BankTitle>{title}</BankTitle>
      <SortableContext items={valueIds} strategy={verticalListSortingStrategy}>
        <CardList>
          {children ? children : values.map(value => (
            <SortableValueCard key={value.id} value={value} />
          ))}
        </CardList>
      </SortableContext>
    </BankContainer>
  );
};