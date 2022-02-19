import { useState } from 'react';
import './App.css';
import { HandleBarPreview } from './HandleBarPreview';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <HandleBarPreview />
    </div>
  );
}

export default App;
