import { useState } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay, useDraggable, useDroppable, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import Draggable from 'react-draggable';
import { useGame } from '../context/GameContext';
import type { Value, CanvasCard } from '../types/types';
import { PageLayout } from '../components/PageLayout';
import { InstructionsPanel } from '../components/InstructionsPanel';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import { AppHeader } from '../components/AppHeader'; // Import the new header

// ... (rest of the styled-components and helper components for Round 3 remain the same)
const Round3Layout = styled.div` display: flex; gap: 24px; height: 70vh; `;
const Sidebar = styled.div` width: 300px; display: flex; flex-direction: column; gap: 24px; `;
const ValueListContainer = styled.div<{ isOver: boolean }>` flex: 1; display: flex; flex-direction: column; background-color: ${({ isOver }) => isOver ? '#E6F7FF' : '#F8F9FA'}; border: 1px solid #dee2e6; border-radius: 8px; `;
const ListTitle = styled.h3` font-weight: 600; padding: 16px; margin: 0; border-bottom: 1px solid #dee2e6; `;
const CardList = styled.div` padding: 16px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; `;
const CanvasArea = styled.div<{ isOver: boolean }>` flex-grow: 1; position: relative; background-color: ${({ isOver }) => isOver ? '#f0f8ff' : '#FFFFFF'}; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; `;
const ResizableCardWrapper = styled.div` position: absolute; z-index: 10; `;
const ResizeHandle = styled.div` position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: se-resize; background: rgba(0, 0, 0, 0.1); border-top: 2px solid rgba(0,0,0,0.4); border-left: 2px solid rgba(0,0,0,0.4); `;
const ResizableDraggableCanvasCard = ({ card }: { card: CanvasCard }) => { const { dispatch } = useGame(); const [size, setSize] = useState(card.size); return ( <Draggable position={card.position} onStop={(_, data) => dispatch({ type: 'UPDATE_CANVAS_POSITION_R3', payload: { instanceId: card.instanceId, position: { x: data.x, y: data.y } } })} handle=".drag-handle"> <ResizableCardWrapper style={{ width: size.width, height: size.height, left: card.position.x, top: card.position.y }}> <div className="drag-handle" style={{ width: '100%', height: '100%' }}> <ValueCard value={card.value} color={card.isCore ? '#FFFFFF' : '#E6F7FF'} /> </div> <Draggable onDrag={(_, data) => setSize({ width: Math.max(150, size.width + data.deltaX), height: Math.max(100, size.height + data.deltaY) })} onStop={() => dispatch({ type: 'UPDATE_CANVAS_SIZE_R3', payload: { instanceId: card.instanceId, size } })}> <ResizeHandle /> </Draggable> </ResizableCardWrapper> </Draggable> ); };
const DraggableSidebarCard = ({ value, listType, index }: { value: Value, listType: 'core' | 'additional', index: number }) => { const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `${listType}-${index}`, data: { current: { value, isCore: listType === 'core' } } }); return <div ref={setNodeRef} {...listeners} {...attributes}><ValueCard value={value} isDragging={isDragging} color={listType === 'core' ? '#FFFFFF' : '#E6F7FF'} /></div>; };

export const Round3 = () => {
    const { state, dispatch } = useGame();
    const { coreValues, additionalValues, mappedCanvas } = state.round3;
    const [activeValue, setActiveValue] = useState<Value | null>(null);
    const { setNodeRef: canvasRef, isOver: isOverCanvas } = useDroppable({ id: 'canvas-r3' });
    const { setNodeRef: coreListRef, isOver: isOverCore } = useDroppable({ id: 'core-list' });
    const { setNodeRef: additionalListRef, isOver: isOverAdditional } = useDroppable({ id: 'additional-list' });
    const handleDragStart = (event: DragStartEvent) => setActiveValue(event.active.data.current?.value ?? null);
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveValue(null);
        const { active, over } = event;
        if (!over || !active.data.current) return;
        const sourceId = active.id.toString();
        const destId = over.id.toString();
        const value = active.data.current.value as Value;
        if (destId === 'canvas-r3' && sourceId.includes('-')) { const isCore = active.data.current.isCore; const dropPosition = { x: event.delta.x, y: event.delta.y }; dispatch({ type: 'COPY_TO_CANVAS_R3', payload: { value, isCore, position: dropPosition } }); return; }
        if (sourceId.includes('-') && destId.includes('-')) { const [sourceType, sourceIndexStr] = sourceId.split('-'); const [destType, destIndexStr] = destId.split('-'); if (sourceType !== destType) { dispatch({ type: 'SWAP_VALUES_R3', payload: { from: { list: sourceType as 'core' | 'additional', index: parseInt(sourceIndexStr) }, to: { list: destType as 'core' | 'additional', index: parseInt(destIndexStr) } } }); } }
    };

    return (
        <PageLayout
            header={<AppHeader />} // Add the header here
            footer={ <div style={{ display: 'flex', justifyContent: 'space-between' }}> <Button onClick={() => dispatch({ type: 'GO_BACK_TO_ROUND_2' })}>Back</Button> <Button onClick={() => dispatch({ type: 'ADVANCE_TO_RESULTS' })}>Finish</Button> </div> }>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
                <InstructionsPanel title="Round 3: The Value Map"> <p>This is your final canvas. Drag your values from the sidebar to create a visual map of what's important to you. Cards dragged from the sidebar are copies, so you can use a value multiple times.</p> <p>Arrange them, resize them, and group them in a way that makes sense to you. You can also swap values between your 'Core' and 'Additional' lists.</p> </InstructionsPanel>
                <Round3Layout>
                    <Sidebar>
                        <ValueListContainer ref={coreListRef} isOver={isOverCore}> <ListTitle>Core Values</ListTitle> <CardList>{coreValues.map((v, i) => <DraggableSidebarCard key={v.id} value={v} listType="core" index={i} />)}</CardList> </ValueListContainer>
                        <ValueListContainer ref={additionalListRef} isOver={isOverAdditional}> <ListTitle>Additional Candidates</ListTitle> <CardList>{additionalValues.map((v, i) => <DraggableSidebarCard key={v.id} value={v} listType="additional" index={i} />)}</CardList> </ValueListContainer>
                    </Sidebar>
                    <CanvasArea ref={canvasRef} isOver={isOverCanvas}> {mappedCanvas.map(card => <ResizableDraggableCanvasCard key={card.instanceId} card={card} />)} </CanvasArea>
                </Round3Layout>
                <DragOverlay> {activeValue ? <ValueCard value={activeValue} isDragging={true} /> : null} </DragOverlay>
            </DndContext>
        </PageLayout>
    );
};