import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import MenuPage from './pages/menuPage'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<MenuPage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
