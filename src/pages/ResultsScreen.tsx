import { useRef } from 'react';
import styled from 'styled-components';
import { toPng } from 'html-to-image';
import { useGame } from '../context/GameContext';
import { PageLayout } from '../components/PageLayout';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import { AppHeader } from '../components/AppHeader'; // Import the new header

// ... (rest of the styled-components for ResultsScreen remain the same)
const ResultsLayout = styled.div` display: flex; flex-direction: column; align-items: center; gap: 24px; `;
const ResultsTitle = styled.h1` font-family: 'Inter', sans-serif; font-weight: 600; font-size: 32px; `;
const CanvasContainer = styled.div` position: relative; width: 100%; max-width: 1000px; height: 70vh; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; `;
const StaticCardWrapper = styled.div` position: absolute; `;

export const ResultsScreen = () => {
  const { state } = useGame();
  const { mappedCanvas } = state.round3;
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (canvasRef.current === null) return;
    toPng(canvasRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-value-map.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => { console.error('Failed to export image', err); });
  };

  return (
    <PageLayout
      header={<AppHeader />} // Add the header here
      footer={
        // The "Start Over" button is now in the header, so we only need the Export button here.
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button onClick={handleExport}>Export as Image</Button>
        </div>
      }
    >
      <ResultsLayout>
        <ResultsTitle>Your Personal Value Map</ResultsTitle>
        <CanvasContainer ref={canvasRef}>
          {mappedCanvas.map(card => (
            <StaticCardWrapper
              key={card.instanceId}
              style={{ left: `${card.position.x}px`, top: `${card.position.y}px`, width: `${card.size.width}px`, height: `${card.size.height}px` }}
            >
              <ValueCard value={card.value} color={card.isCore ? '#FFFFFF' : '#E6F7FF'} />
            </StaticCardWrapper>
          ))}
        </CanvasContainer>
      </ResultsLayout>
    </PageLayout>
  );
};