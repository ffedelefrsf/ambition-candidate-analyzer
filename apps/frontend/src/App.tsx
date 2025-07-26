import { useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const { VITE_API_BASE_URL } = import.meta.env;

function App() {
  const [count, setCount] = useState(0);
  const oneRef = useRef<boolean>(false);

  useEffect(() => {
    if (!oneRef.current) {
      fetch(`${VITE_API_BASE_URL}/test/`)
        .then((res) => res.json())
        .then((data) => {
          alert(JSON.stringify({ message: data.message }));
        })
        .catch((error) => alert(JSON.stringify(error, null, 2)));
      oneRef.current = true;
    }
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
