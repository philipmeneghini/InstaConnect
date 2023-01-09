import './App.css';
import { DatabaseTester } from './components/DatabaseTester';
import React from 'react'

function App() {
  return (
    <div className = "App">
      <DatabaseTester value = "Database Not Connected"/>
    </div>
  );
}

export default App;
