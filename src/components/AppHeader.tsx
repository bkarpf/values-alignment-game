import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { Button } from './Button';

const HeaderContainer = styled.header`
  padding: 16px 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #DEE2E6;
  display: flex;
  align-items: center;
`;

export const AppHeader = () => {
  const { dispatch } = useGame();

  const handleStartOver = () => {
    const isConfirmed = window.confirm(
      'Are you sure? This will restart the game and all your progress will be lost.'
    );
    if (isConfirmed) {
      dispatch({ type: 'RESTART_GAME' });
    }
  };

  return (
    <HeaderContainer>
      <Button onClick={handleStartOver} variant="secondary">
        Start Over
      </Button>
    </HeaderContainer>
  );
};