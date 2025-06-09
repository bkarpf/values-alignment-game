import { useGame } from './context/GameContext';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { Round1 } from './pages/Round1';
import { Round2 } from './pages/Round2';
import { Round3 } from './pages/Round3';
import { ResultsScreen } from './pages/ResultsScreen';

function App() {
  const { state } = useGame();

  // This switch statement acts as our page router.
  // We now use the actual components for each round.
  switch (state.round) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'round1':
      return <Round1 />;
    case 'round2':
      return <Round2 />;
    case 'round3':
      return <Round3 />;
    case 'results':
      return <ResultsScreen />;
    default:
      // Fallback to the WelcomeScreen if the state is ever invalid
      return <WelcomeScreen />;
  }
}

export default App;