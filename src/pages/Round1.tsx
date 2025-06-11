import { useState, useMemo } from 'react';
import type { FC } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { PageLayout } from '../components/PageLayout';
import { InstructionsPanel } from '../components/InstructionsPanel';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import type { Value, GameState } from '../types/types';
import { AppHeader } from '../components/AppHeader';

// --- Type Definitions ---
type ListType = keyof GameState['round1'];
type DraggableItemData = {
    type: ListType;
    value: Value;
};

// --- Styled Components ---
const Round1Layout = styled.div`
  display: flex;
  gap: 24px;
  align-items: stretch;
  height: 85vh; /* Increased for consistency */
`;

const BinsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 24px;
`;

const DropZoneContainer = styled.div<{ $isOver: boolean }>`
  flex: 1;
  min-width: 200px;
  height: 100%;
  background-color: ${({ $isOver }) => ($isOver ? '#E6F7FF' : '#FFFFFF')};
  border: 1px solid #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease-in-out;
`;

const DropZoneTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 20px;
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  margin: 0;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
`;

const CardList = styled.div`
  flex-grow: 1;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
  overflow-y: auto;
`;

// --- Draggable & Droppable Item ---
const DraggableItem: FC<{ value: Value; listType: ListType }> = ({ value, listType }) => {
    const id = `${listType}-${value.id}`;
    const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
        id,
        data: { type: listType, value } as DraggableItemData,
    });

    // REFACTOR: Make every item a droppable target for robust drop detection.
    const { setNodeRef: setDroppableRef } = useDroppable({
        id,
        data: { type: listType },
    });

    const setNodeRef = (node: HTMLElement | null) => {
        setDraggableRef(node);
        setDroppableRef(node);
    };

    // REFACTOR: Hide the original item completely to rely on the DragOverlay.
    const style = {
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <ValueCard value={value} isDragging={isDragging} />
        </div>
    );
};

// --- Drop Zone Component ---
const DropZone: FC<{ id: ListType; title: string; values: Value[] }> = ({ id, title, values }) => {
    const { setNodeRef, isOver } = useDroppable({ id, data: { type: id } });
    return (
        <DropZoneContainer ref={setNodeRef} $isOver={isOver}>
            <DropZoneTitle>{title}</DropZoneTitle>
            <CardList>
                {values.map((value) => (
                    <DraggableItem key={value.id} value={value} listType={id} />
                ))}
            </CardList>
        </DropZoneContainer>
    );
};

// --- Main Page Component ---
export const Round1: FC = () => {
    const { state, dispatch } = useGame();
    const { bank, mostImportant, somewhatImportant, notImportant } = state.round1;
    const [activeItem, setActiveItem] = useState<DraggableItemData | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveItem(event.active.data.current as DraggableItemData);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const sourceItem = active.data.current as DraggableItemData;

        if (over && sourceItem) {
            const destinationList = over.data.current?.type as ListType;
            const sourceList = sourceItem.type;

            if (destinationList && sourceList !== destinationList) {
                dispatch({
                    type: 'SORT_VALUE_R1',
                    payload: {
                        valueId: sourceItem.value.id,
                        sourceList,
                        destinationList,
                    },
                });
            }
        }
        setActiveItem(null);
    };

    const isNextDisabled = useMemo(() => bank.length > 0, [bank]);

    return (
        <PageLayout
            header={<AppHeader />}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => dispatch({ type: 'ADVANCE_TO_ROUND_2' })} disabled={isNextDisabled}>
                        Next Round
                    </Button>
                </div>
            }
        >
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <InstructionsPanel title="Round 1: The Values Sort">
                    <p>Drag each value from the bank on the left into one of the three categories on the right. Go with your first instinct.</p>
                </InstructionsPanel>
                <Round1Layout>
                    <DropZone id="bank" title="Value Bank" values={bank} />
                    <BinsContainer>
                        <DropZone id="mostImportant" title="Matters Most" values={mostImportant} />
                        <DropZone id="somewhatImportant" title="Matters Somewhat" values={somewhatImportant} />
                        <DropZone id="notImportant" title="Doesn't Matter" values={notImportant} />
                    </BinsContainer>
                </Round1Layout>
                <DragOverlay dropAnimation={null}>
                    {activeItem ? <ValueCard value={activeItem.value} isDragging={true} /> : null}
                </DragOverlay>
            </DndContext>
        </PageLayout>
    );
};