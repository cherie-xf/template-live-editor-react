import { useState } from 'react';
import './App.css';
import { HtmlPreview } from './faz/HtmlPreview';
// import { HandleBarPreview } from './HandleBarPreview';

function App() {
  return (
    <div className="App">
      {/* <HandleBarPreview /> */}
      <HtmlPreview />
    </div>
  );
}

export default App;
