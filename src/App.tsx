import Providers from '@/app/Providers';
import AppRouter from '@/app/AppRouter';
import { useGlobalPressFeedback } from '@/lib/usePressFeedback';

const App = () => {
  useGlobalPressFeedback();
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
};

export default App;
