import { useState } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { PageLayout } from '../components/PageLayout';
import { InstructionsPanel } from '../components/InstructionsPanel';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import type { Value } from '../types/types';
import { AppHeader } from '../components/AppHeader';

// --- Styled Components (No Changes) ---
const DropZoneContainer = styled.div<{ $isOver: boolean }>` flex: 1; min-width: 200px; height: 100%; background-color: ${({ $isOver }) => ($isOver ? '#E6F7FF' : '#FFFFFF')}; border: 1px solid #dee2e6; border-radius: 8px; display: flex; flex-direction: column; transition: background-color 0.2s ease-in-out; `;
const DropZoneTitle = styled.h3` font-family: 'Inter', sans-serif; font-weight: 600; font-size: 20px; padding: 16px; border-bottom: 1px solid #dee2e6; margin: 0; background-color: #f8f9fa; border-radius: 8px 8px 0 0; `;
const CardList = styled.div` flex-grow: 1; padding: 16px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 16px; overflow-y: auto; `;
const Round1Layout = styled.div` display: flex; gap: 24px; align-items: stretch; height: 70vh; `;
const BinsContainer = styled.div` flex-grow: 1; display: flex; gap: 24px; `;

// FIX 1: A single, reusable Draggable Card component
const DraggableValueCard = ({ value, sourceList }: { value: Value; sourceList: string }) => {
    // Attach all necessary data directly to the draggable item
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: value.id,
        data: { value, sourceList },
    });

    // While dragging, we can make the original card transparent or hide it
    const style = {
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <ValueCard value={value} isDragging={isDragging} />
        </div>
    );
};

const DropZone = ({ id, title, values }: { id: string; title: string; values: Value[] }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <DropZoneContainer ref={setNodeRef} $isOver={isOver}>
      <DropZoneTitle>{title}</DropZoneTitle>
      <CardList>
        {values.map(value => <DraggableValueCard key={value.id} value={value} sourceList={id} />)}
      </CardList>
    </DropZoneContainer>
  );
};

export const Round1 = () => {
  const { state, dispatch } = useGame();
  const { bank, mostImportant, somewhatImportant, notImportant } = state.round1;
  const [activeValue, setActiveValue] = useState<Value | null>(null);

  // FIX 2: A simple and direct onDragStart handler
  const handleDragStart = (event: DragStartEvent) => {
    // Get the value directly from the event data
    const draggedValue = event.active.data.current?.value;
    if (draggedValue) {
      setActiveValue(draggedValue);
    }
  };

  // FIX 3: A robust and direct onDragEnd handler
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveValue(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sourceList = active.data.current?.sourceList as keyof typeof state.round1;
      const destinationList = over.id as keyof typeof state.round1;
      
      if (sourceList && destinationList) {
        dispatch({
          type: 'SORT_VALUE_R1',
          payload: {
            valueId: active.id.toString(),
            sourceList,
            destinationList,
          },
        });
      }
    }
  };

  return (
    <PageLayout header={<AppHeader />} footer={ <div style={{ display: 'flex', justifyContent: 'flex-end' }}> <Button onClick={() => dispatch({ type: 'ADVANCE_TO_ROUND_2' })} disabled={bank.length > 0}> Next Round </Button> </div> }>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <InstructionsPanel title="Round 1: The Values Sort"> <p>Drag each value from the bank on the left into one of the three categories on the right. Go with your first instinct.</p> </InstructionsPanel>
        <Round1Layout>
          {/* We now pass the sourceList ID to the cards inside the bank */}
          <DropZone id="bank" title="Value Bank" values={bank} />
          <BinsContainer>
            <DropZone id="mostImportant" title="Matters Most" values={mostImportant} />
            <DropZone id="somewhatImportant" title="Matters Somewhat" values={somewhatImportant} />
            <DropZone id="notImportant" title="Doesn't Matter" values={notImportant} />
          </BinsContainer>
        </Round1Layout>
        <DragOverlay dropAnimation={null}>
          {activeValue ? <ValueCard value={activeValue} isDragging={true} /> : null}
        </DragOverlay>
      </DndContext>
    </PageLayout>
  );
};