import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay, useDraggable, useDroppable, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Value, CanvasCard } from '../types/types';
import { useGame } from '../context/GameContext';
import { PageLayout } from '../components/PageLayout';
import { InstructionsPanel } from '../components/InstructionsPanel';
import { ValueSlot } from '../components/ValueSlot';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import { AppHeader } from '../components/AppHeader';

// --- Reusable Components for this Page ---
const DropZone = styled.div<{ $isOver: boolean }>`
  width: 300px;
  height: 100%;
  background-color: ${({ $isOver }) => ($isOver ? '#E6F7FF' : '#F8F9FA')};
  border: 1px solid #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease-in-out;
  flex-shrink: 0;
`;
const DropZoneTitle = styled.h3` font-family: 'Inter', sans-serif; font-weight: 600; font-size: 20px; padding: 16px; border-bottom: 1px solid #dee2e6; margin: 0; `;
const CardList = styled.div` flex-grow: 1; padding: 16px; overflow-y: auto; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 16px; `;

type DraggableItemData = | { type: 'bank'; value: Value } | { type: 'canvas'; card: CanvasCard } | { type: 'slot'; value: Value; slotType: 'topTen' | 'additional'; index: number };

const DraggableItem = ({ data, children }: { data: DraggableItemData, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: data.type === 'canvas' ? data.card.instanceId : data.value.id,
        data,
    });
    const style = { opacity: isDragging ? 0 : 1, zIndex: isDragging ? 1001 : 100 };
    return <div ref={setNodeRef} style={style} {...listeners} {...attributes}>{children}</div>;
};

// --- Main Layout Components ---
const Round2Layout = styled.div` display: flex; gap: 24px; height: 55vh; `;
const MainArea = styled.div<{ $isOver: boolean }>` flex-grow: 1; position: relative; background-color: ${({ $isOver }) => ($isOver ? '#E6F7FF' : '#FFFFFF')}; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden;`;
const SlotsContainer = styled.div` margin-top: 24px; display: flex; flex-direction: column; gap: 16px; `;
const SlotRow = styled.div` display: flex; gap: 16px; padding-bottom: 16px; overflow-x: auto; `;
const SlotRowTitle = styled.h3` margin: 0 0 8px 0; font-weight: 600; `;

export const Round2 = () => {
    const { state, dispatch } = useGame();
    const { bank, canvas, topTenSlots, additionalSlots } = state.round2;
    const [activeItem, setActiveItem] = useState<DraggableItemData | null>(null);

    const { setNodeRef: canvasRef, isOver: isOverCanvas } = useDroppable({ id: 'canvas-r2' });
    const { setNodeRef: bankRef, isOver: isOverBank } = useDroppable({ id: 'bank-r2' });

    const handleDragStart = (event: DragStartEvent) => {
        setActiveItem(event.active.data.current as DraggableItemData);
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveItem(null);
        const { active, over } = event;
        if (!over || !active.data.current) return;

        const item = active.data.current as DraggableItemData;
        const overId = over.id.toString();

        // FIX: This is the complete, robust logic for all drop targets.
        if (overId === 'canvas-r2') {
            const position = { x: event.delta.x + (active.rect.current.initial?.left ?? 0), y: event.delta.y + (active.rect.current.initial?.top ?? 0) };
            if (item.type === 'canvas') {
                // If dragging from the canvas to the canvas, just update position
                dispatch({ type: 'UPDATE_CANVAS_POSITION_R2', payload: { instanceId: item.card.instanceId, position } });
            } else {
                // If dragging from bank or slot to canvas, place it
                dispatch({ type: 'PLACE_ON_CANVAS_R2', payload: { item, position } });
            }
        } else if (overId === 'bank-r2') {
            // If dropping on the bank, dispatch the return action
            dispatch({ type: 'RETURN_TO_BANK_R2', payload: { item } });
        } else if (overId.startsWith('slot-')) {
            // If dropping on a slot, handle placement
            const [, slotType, indexStr] = overId.split('-');
            const index = parseInt(indexStr);
            const targetSlotArray = slotType === 'topTen' ? topTenSlots : additionalSlots;
            if (targetSlotArray[index] !== null) return; // Prevent dropping on a filled slot

            dispatch({ type: 'PLACE_IN_SLOT_R2', payload: { item, slotType: slotType as 'topTen' | 'additional', index } });
        }
    };
    
    const isNextDisabled = useMemo(() => topTenSlots.some(slot => slot === null), [topTenSlots]);

    return (
        <PageLayout header={<AppHeader />} footer={ <div style={{ display: 'flex', justifyContent: 'space-between' }}> <Button onClick={() => dispatch({ type: 'GO_BACK_TO_ROUND_1' })}>Back</Button> <Button onClick={() => dispatch({ type: 'ADVANCE_TO_ROUND_3' })} disabled={isNextDisabled}>Next Round</Button> </div> }>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
                <InstructionsPanel title="Round 2: Winnowing to Core Values"> <p>From your "Matters Most" list, drag values to the "Top Ten Values" slots. Use the canvas area as a temporary space to compare and contrast values before making your final choices.</p> </InstructionsPanel>
                <Round2Layout>
                    <DropZone ref={bankRef} $isOver={isOverBank}>
                        <DropZoneTitle>Value Bank</DropZoneTitle>
                        <CardList>
                            {bank.map(value => (
                                <DraggableItem key={value.id} data={{ type: 'bank', value }}>
                                    <ValueCard value={value} />
                                </DraggableItem>
                            ))}
                        </CardList>
                    </DropZone>
                    <MainArea ref={canvasRef} $isOver={isOverCanvas}>
                        {canvas.map(card => (
                            <DraggableItem key={card.instanceId} data={{ type: 'canvas', card }}>
                                <div style={{ position: 'absolute', left: card.position.x, top: card.position.y }}>
                                    <ValueCard value={card.value} />
                                </div>
                            </DraggableItem>
                        ))}
                    </MainArea>
                </Round2Layout>
                <SlotsContainer>
                    <div> <SlotRowTitle>Top Ten Values</SlotRowTitle> <SlotRow> {topTenSlots.map((value, index) => ( <ValueSlot key={`top-${index}`} value={null} droppableId={`slot-topTen-${index}`} placeholderText={`Core ${index + 1}`}> {value && <DraggableItem data={{ type: 'slot', value, slotType: 'topTen', index }}><ValueCard value={value} /></DraggableItem>} </ValueSlot> ))} </SlotRow> </div>
                    <div> <SlotRowTitle>Additional Candidates</SlotRowTitle> <SlotRow> {additionalSlots.map((value, index) => ( <ValueSlot key={`add-${index}`} value={null} droppableId={`slot-additional-${index}`} placeholderText="Candidate"> {value && <DraggableItem data={{ type: 'slot', value, slotType: 'additional', index }}><ValueCard value={value} /></DraggableItem>} </ValueSlot> ))} </SlotRow> </div>
                </SlotsContainer>
                <DragOverlay dropAnimation={null}>
                    {activeItem ? <ValueCard value={activeItem.type === 'canvas' ? activeItem.card.value : activeItem.value} isDragging={true} /> : null}
                </DragOverlay>
            </DndContext>
        </PageLayout>
    );
};