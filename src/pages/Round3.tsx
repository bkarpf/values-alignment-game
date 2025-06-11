import { useState, useRef } from 'react';
import type { FC } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { useGame } from '../context/GameContext';
import type { Value, CanvasCard } from '../types/types';

// Import Components
import { PageLayout } from '../components/PageLayout';
import { AppHeader } from '../components/AppHeader';
import { InstructionsPanel } from '../components/InstructionsPanel';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import { FreeCanvas } from '../components/FreeCanvas';

// --- Type Definitions ---
type DraggableItemData =
  | { type: 'core'; value: Value; index: number }
  | { type: 'additional'; value: Value; index: number }
  | { type: 'canvas'; value: Value; card: CanvasCard };


// --- Styled Components ---
const Round3Layout = styled.div`
  display: flex;
  gap: 24px;
  align-items: stretch;
  height: 85vh;
  margin-top: 16px;
`;

const Sidebar = styled.div`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #dee2e6;
`;

const ValueListContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: #FFFFFF;
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;

const ValueList = styled.div<{ $isOver: boolean }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  background-color: ${({ $isOver }) => ($isOver ? '#d4edda' : 'transparent')};
  transition: background-color 0.2s ease-in-out;
  overflow-y: auto;
`;

const ListTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 20px;
  padding: 8px 8px 0;
  margin: 0;
`;

const CanvasWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  border-radius: 8px;
  min-width: 0;
  border: 1px solid #dee2e6;
`;

// --- Draggable Components ---

const DraggableBankItem: FC<{ item: Value; listType: 'core' | 'additional'; index: number }> = ({ item, listType, index }) => {
    const draggableId = `${listType}-item-${item.id}`;
    const droppableId = draggableId;

    const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
        id: draggableId,
        data: { type: listType, value: item, index } as DraggableItemData,
    });

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: droppableId,
        data: { type: listType, index },
    });

    const setNodeRef = (node: HTMLElement | null) => {
        setDraggableRef(node);
        setDroppableRef(node);
    };

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="dnd-draggable" style={{ opacity: isDragging ? 0.5 : 1 }}>
            {/* FIX: Swapped the colors */}
            <ValueCard value={item} isDragging={isDragging} color={listType === 'core' ? '#FFF3CD' : '#FFFFFF'} />
        </div>
    );
};

const DraggableCanvasItem: FC<{ card: CanvasCard }> = ({ card }) => {
    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
        id: card.instanceId,
        data: { type: 'canvas', value: card.value, card } as DraggableItemData,
    });

    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 1000 } : {};

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="dnd-draggable" style={style}>
            <div style={{ width: card.size.width, height: card.size.height, opacity: isDragging ? 0 : 1 }}>
                {/* FIX: Swapped the colors */}
                <ValueCard value={card.value} isDragging={isDragging} color={card.isCore ? '#FFF3CD' : '#FFFFFF'} />
            </div>
        </div>
    );
};

// --- Main Page Component ---

export const Round3: FC = () => {
    const { state, dispatch } = useGame();
    const { coreValues, additionalValues, mappedCanvas } = state.round3;
    const [activeItem, setActiveItem] = useState<DraggableItemData | null>(null);
    const [dragNodeOffset, setDragNodeOffset] = useState({ x: 0, y: 0 });

    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const transformRef = useRef<ReactZoomPanPinchRef>(null);

    const { setNodeRef: coreListRef, isOver: isOverCore } = useDroppable({ id: 'core-list' });
    const { setNodeRef: additionalListRef, isOver: isOverAdditional } = useDroppable({ id: 'additional-list' });

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
            const sourceType = sourceItem.type;
            const overId = over.id.toString();
            
            let destinationList: 'core' | 'additional' | null = null;
            if (overId.startsWith('core')) destinationList = 'core';
            if (overId.startsWith('additional')) destinationList = 'additional';

            if (destinationList) {
                if (sourceType === 'canvas') {
                    if (destinationList === 'core' && coreValues.length >= 10 && !coreValues.some(v => v.id === sourceItem.value.id)) {
                        alert('Only 10 values are allowed in the Core list.');
                    } else {
                        dispatch({ type: 'RETURN_TO_BANK_R3', payload: { card: sourceItem.card!, destinationList } });
                    }
                } else if (sourceType !== destinationList) {
                    if (destinationList === 'core' && coreValues.length >= 10) {
                        alert('Only 10 values are allowed in the Core list.');
                    } else {
                        const toIndex = over.data.current?.index ?? (destinationList === 'core' ? coreValues.length : additionalValues.length);
                        dispatch({ type: 'SWAP_VALUES_R3', payload: { from: { list: sourceType, index: sourceItem.index! }, to: { list: destinationList, index: toIndex } } });
                    }
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

                if (finalX >= canvasRect.left && finalX <= canvasRect.right && finalY >= canvasRect.top && finalY <= canvasRect.bottom) {
                    const internalX = (finalX - canvasRect.left - positionX) / scale;
                    const internalY = (finalY - canvasRect.top - positionY) / scale;
                    
                    const position = {
                        x: internalX - (dragNodeOffset.x / scale),
                        y: internalY - (dragNodeOffset.y / scale),
                    };

                    if (sourceItem.type === 'canvas') {
                        dispatch({ type: 'UPDATE_CANVAS_POSITION_R3', payload: { instanceId: sourceItem.card!.instanceId, position } });
                    } else if (sourceItem.type === 'core' || sourceItem.type === 'additional') {
                        dispatch({ type: 'COPY_TO_CANVAS_R3', payload: { value: sourceItem.value, isCore: sourceItem.type === 'core', position } });
                    }
                }
            }
        }

        setActiveItem(null);
    };

    return (
        <PageLayout
            header={<AppHeader />}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => dispatch({ type: 'GO_BACK_TO_ROUND_2' })}>Back</Button>
                    <Button onClick={() => dispatch({ type: 'ADVANCE_TO_RESULTS' })}>Finish</Button>
                </div>
            }
        >
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <InstructionsPanel title="Round 3: The Value Map">
                    <p>
                        This is your final map. Drag copies of your values from the sidebar onto the canvas. Arrange them to
                        represent their relationships and importance to you. You can also swap values between the lists or drag them back from the canvas.
                    </p>
                </InstructionsPanel>

                <Round3Layout>
                    <Sidebar>
                        <ValueListContainer>
                            <ListTitle>Core Values</ListTitle>
                            <ValueList ref={coreListRef} $isOver={isOverCore}>
                                {coreValues.map((value, index) => (
                                    <DraggableBankItem key={value.id} item={value} listType="core" index={index} />
                                ))}
                            </ValueList>
                        </ValueListContainer>
                        <ValueListContainer>
                            <ListTitle>Additional Candidates</ListTitle>
                            <ValueList ref={additionalListRef} $isOver={isOverAdditional}>
                                {additionalValues.map((value, index) => (
                                    <DraggableBankItem key={value.id} item={value} listType="additional" index={index} />
                                ))}
                            </ValueList>
                        </ValueListContainer>
                    </Sidebar>

                    <CanvasWrapper ref={canvasWrapperRef}>
                        <FreeCanvas ref={transformRef}>
                            {mappedCanvas.map(card => (
                                <div key={card.instanceId} style={{ position: 'absolute', top: card.position.y, left: card.position.x, zIndex: card.zIndex }}>
                                    <DraggableCanvasItem card={card} />
                                </div>
                            ))}
                        </FreeCanvas>
                    </CanvasWrapper>
                </Round3Layout>

                <DragOverlay dropAnimation={null}>
                    {/* FIX: Swapped the colors */}
                    {activeItem ? <ValueCard value={activeItem.value} isDragging={true} color={activeItem.type === 'core' || (activeItem.type === 'canvas' && activeItem.card.isCore) ? '#FFF3CD' : '#FFFFFF'} /> : null}
                </DragOverlay>
            </DndContext>
        </PageLayout>
    );
};