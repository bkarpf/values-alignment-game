import { useState, useMemo, useRef } from 'react';
import type { FC } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay, useDraggable, useDroppable, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { useGame } from '../context/GameContext';
import type { Value, CanvasCard, DraggedItemSourceR2 } from '../types/types';

// Import Components
import { PageLayout } from '../components/PageLayout';
import { AppHeader } from '../components/AppHeader';
import { InstructionsPanel } from '../components/InstructionsPanel';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import { ValueBank } from '../components/ValueBank';
import { ValueSlot } from '../components/ValueSlot';
import { FreeCanvas } from '../components/FreeCanvas';

// --- Type Definitions ---
type DraggableItemData = DraggedItemSourceR2;

// --- Styled Components ---
const Round2Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  margin-top: 16px;
`;

const TopArea = styled.div`
  display: flex;
  gap: 24px;
  align-items: stretch;
  flex-grow: 1;
  min-height: 0;
`;

const CanvasWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  border-radius: 8px;
  min-width: 0;
  border: 1px solid #dee2e6;
`;

const SlotsSection = styled.div`
  flex-shrink: 0;
  border-top: 1px solid #dee2e6;
  padding-top: 16px;
`;

const SlotsRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 8px;
`;

const SlotContainer = styled.div<{ $isOver: boolean }>`
  border: 2px dashed ${({ $isOver }) => ($isOver ? '#007AFF' : 'transparent')};
  border-radius: 10px;
  transition: border-color 0.2s ease-in-out;
  flex-shrink: 0;
`;

const DroppableBankContainer = styled.div<{ $isOver: boolean }>`
  height: 100%;
  border-radius: 8px;
  background-color: ${({ $isOver }) => ($isOver ? '#E6F7FF' : 'transparent')};
  transition: background-color 0.2s ease-in-out;
`;

// --- Draggable Components ---

const DraggableBankValue: FC<{ value: Value }> = ({ value }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `bank-${value.id}`,
        data: { type: 'bank', value } as DraggableItemData,
    });
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="dnd-draggable" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <ValueCard value={value} isDragging={isDragging} />
        </div>
    );
};

const DraggableCanvasValue: FC<{ card: CanvasCard }> = ({ card }) => {
    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
        id: card.instanceId,
        data: { type: 'canvas', value: card.value, card } as DraggableItemData,
    });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 1000 } : {};

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="dnd-draggable" style={style}>
            <div style={{ width: card.size.width, height: card.size.height, opacity: isDragging ? 0 : 1 }}>
                 <ValueCard value={card.value} isDragging={isDragging} />
            </div>
        </div>
    );
};

const DraggableSlotValue: FC<{ value: Value; slotType: 'topTen' | 'additional'; index: number }> = ({ value, slotType, index }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `slot-${slotType}-${index}`,
        data: { type: 'slot', value, slotType, index } as DraggableItemData,
    });
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="dnd-draggable" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <ValueCard value={value} isDragging={isDragging} />
        </div>
    );
};

// --- Droppable Components ---

const DroppableValueSlot: FC<{ slotType: 'topTen' | 'additional'; index: number; value: Value | null }> = ({ slotType, index, value }) => {
    const droppableId = `${slotType}-${index}`;
    const { setNodeRef, isOver } = useDroppable({ id: droppableId, disabled: value !== null });

    return (
        <SlotContainer ref={setNodeRef} $isOver={isOver && !value}>
            <ValueSlot droppableId={droppableId} value={value} placeholderText={slotType === 'topTen' ? 'Top 10' : 'Candidate'}>
                {value && <DraggableSlotValue value={value} slotType={slotType} index={index} />}
            </ValueSlot>
        </SlotContainer>
    );
};

// --- Main Page Component ---

export const Round2: FC = () => {
    const { state, dispatch } = useGame();
    const { bank, canvas, topTenSlots, additionalSlots } = state.round2;
    const [activeItem, setActiveItem] = useState<DraggableItemData | null>(null);
    const [dragNodeOffset, setDragNodeOffset] = useState({ x: 0, y: 0 });

    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const transformRef = useRef<ReactZoomPanPinchRef>(null);
    const { setNodeRef: bankRef, isOver: isOverBank } = useDroppable({ id: 'bank' });

    const handleDragStart = (event: DragStartEvent) => {
        const { active, activatorEvent } = event;
        setActiveItem(active.data.current as DraggableItemData);

        if (active.rect.current.initial && 'clientX' in activatorEvent) {
            const startX = active.rect.current.initial.left;
            const startY = active.rect.current.initial.top;
            const cursorX = activatorEvent.clientX;
            const cursorY = activatorEvent.clientY;
            setDragNodeOffset({
                x: cursorX - startX,
                y: cursorY - startY,
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;
        const sourceItem = active.data.current as DraggableItemData;

        if (!sourceItem) {
            setActiveItem(null);
            return;
        }

        if (over) {
            const destinationId = over.id.toString();
            if (destinationId.startsWith('topTen-') || destinationId.startsWith('additional-')) {
                const [slotType, indexStr] = destinationId.split('-');
                const index = parseInt(indexStr, 10);
                dispatch({
                    type: 'PLACE_IN_SLOT_R2',
                    payload: { item: sourceItem, slotType: slotType as 'topTen' | 'additional', index },
                });
            } else if (destinationId === 'bank') {
                if (sourceItem.type !== 'bank') {
                    dispatch({ type: 'RETURN_TO_BANK_R2', payload: { item: sourceItem } });
                }
            }
        } else {
            const canvasRect = canvasWrapperRef.current?.getBoundingClientRect();
            const initialRect = active.rect.current.initial;
            const transformState = transformRef.current?.instance.transformState;

            if (canvasRect && initialRect && transformState) {
                const { scale, positionX, positionY } = transformState;
                const finalX = initialRect.left + delta.x;
                const finalY = initialRect.top + delta.y;

                if (
                    finalX >= canvasRect.left &&
                    finalX <= canvasRect.right &&
                    finalY >= canvasRect.top &&
                    finalY <= canvasRect.bottom
                ) {
                    const internalX = (finalX - canvasRect.left - positionX) / scale;
                    const internalY = (finalY - canvasRect.top - positionY) / scale;
                    
                    const position = {
                        x: internalX - (dragNodeOffset.x / scale),
                        y: internalY - (dragNodeOffset.y / scale),
                    };
                    
                    dispatch({ type: 'PLACE_ON_CANVAS_R2', payload: { item: sourceItem, position } });
                } else {
                    if (sourceItem.type !== 'bank') {
                        dispatch({ type: 'RETURN_TO_BANK_R2', payload: { item: sourceItem } });
                    }
                }
            } else {
                if (sourceItem.type !== 'bank') {
                    dispatch({ type: 'RETURN_TO_BANK_R2', payload: { item: sourceItem } });
                }
            }
        }

        setActiveItem(null);
    };

    const isNextDisabled = useMemo(() => topTenSlots.includes(null), [topTenSlots]);

    return (
        <PageLayout
            header={<AppHeader />}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => dispatch({ type: 'GO_BACK_TO_ROUND_1' })}>Back</Button>
                    <Button onClick={() => dispatch({ type: 'ADVANCE_TO_ROUND_3' })} disabled={isNextDisabled}>
                        Next Round
                    </Button>
                </div>
            }
        >
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
                <InstructionsPanel title="Round 2: Winnowing to Core Values">
                    <p>
                        Drag your most important values into the "Top 10" slots. Use the canvas to freely arrange and compare values.
                        You can also place some in the "Candidates" row. You must fill all "Top 10" slots to proceed.
                    </p>
                </InstructionsPanel>

                <Round2Layout>
                    <TopArea>
                        <DroppableBankContainer ref={bankRef} $isOver={isOverBank}>
                            <ValueBank title="Value Bank" droppableId="bank" values={bank}>
                                {bank.map(value => (
                                    <DraggableBankValue key={value.id} value={value} />
                                ))}
                            </ValueBank>
                        </DroppableBankContainer>

                        <CanvasWrapper ref={canvasWrapperRef}>
                            <FreeCanvas ref={transformRef}>
                                {canvas.map(card => (
                                    // FIX: Apply the zIndex from the state to the wrapper div
                                    <div key={card.instanceId} style={{ position: 'absolute', top: card.position.y, left: card.position.x, zIndex: card.zIndex }}>
                                        <DraggableCanvasValue card={card} />
                                    </div>
                                ))}
                            </FreeCanvas>
                        </CanvasWrapper>
                    </TopArea>

                    <SlotsSection>
                        <SlotsRow>
                            {topTenSlots.map((value, index) => (
                                <DroppableValueSlot key={`topTen-${index}`} slotType="topTen" index={index} value={value} />
                            ))}
                        </SlotsRow>
                        <SlotsRow style={{ marginTop: '16px' }}>
                            {additionalSlots.map((value, index) => (
                                <DroppableValueSlot key={`additional-${index}`} slotType="additional" index={index} value={value} />
                            ))}
                        </SlotsRow>
                    </SlotsSection>
                </Round2Layout>

                <DragOverlay dropAnimation={null}>
                    {activeItem ? <ValueCard value={activeItem.value} isDragging={true} /> : null}
                </DragOverlay>
            </DndContext>
        </PageLayout>
    );
};