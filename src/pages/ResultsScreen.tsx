import { useRef } from 'react';
import styled from 'styled-components';
import { toPng } from 'html-to-image';
import { useGame } from '../context/GameContext';
import { PageLayout } from '../components/PageLayout';
import { Button } from '../components/Button';
import { ValueCard } from '../components/ValueCard';
import { AppHeader } from '../components/AppHeader';

// --- Styled Components ---
const ResultsLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const ResultsTitle = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 32px;
  color: #212529;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 70vh;
  background-color: #f8f9fa; /* Use Neutral Background for consistency */
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
`;

const StaticCardWrapper = styled.div`
  position: absolute;
`;

// --- Main Page Component ---

export const ResultsScreen = () => {
  const { state, dispatch } = useGame();
  const { mappedCanvas } = state.round3;
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (canvasRef.current === null) {
      console.error('Canvas reference is not available for export.');
      return;
    }
    toPng(canvasRef.current, { cacheBust: true, backgroundColor: '#f8f9fa' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-value-map.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to export image', err);
      });
  };

  const handleBack = () => {
    // This action should navigate the user back to Round 3
    dispatch({ type: 'GO_BACK_TO_ROUND_3' });
  };

  return (
    <PageLayout
      header={<AppHeader />}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button onClick={handleBack}>Back</Button>
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
              style={{
                left: `${card.position.x}px`,
                top: `${card.position.y}px`,
                width: `${card.size.width}px`,
                height: `${card.size.height}px`,
                zIndex: card.zIndex,
              }}
            >
              {/* FIX: Apply the final, correct color scheme from our lessons learned */}
              <ValueCard value={card.value} color={card.isCore ? '#FFF3CD' : '#FFFFFF'} />
            </StaticCardWrapper>
          ))}
        </CanvasContainer>
      </ResultsLayout>
    </PageLayout>
  );
};