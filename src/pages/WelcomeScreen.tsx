import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { ALL_VALUES } from '../data/values';
import { PageLayout } from '../components/PageLayout';
import { InstructionsPanel } from '../components/InstructionsPanel';
import { Button } from '../components/Button';

const WelcomeLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 600px;
  margin: 48px auto;
`;

const WelcomeTitle = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 24px;
`;

export const WelcomeScreen = () => {
  const { dispatch } = useGame();

  const handleBegin = () => {
    // As per spec 5.1, this action clears any old session
    // and transitions the user to Round 1 with a fresh set of values.
    dispatch({ type: 'START_GAME', payload: { allValues: ALL_VALUES } });
  };

  return (
    <PageLayout>
      <WelcomeLayout>
        <WelcomeTitle>Discover Your Core Values</WelcomeTitle>
        <InstructionsPanel title="Welcome to the Values Alignment Game">
          <p>This short, interactive exercise will help you clarify what is most important to you. You will sort, group, and map a list of common values to create a personal value map that you can save and reflect on.</p>
        </InstructionsPanel>
        <Button onClick={handleBegin}>Begin Your Journey</Button>
      </WelcomeLayout>
    </PageLayout>
  );
};
