import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import MenuPage from './pages/MenuPage'
import { AuthenticationApiClient } from './api_views/AuthenticationApiClient'
import { UserApiClient } from './api_views/UserApiClient'
import ValidationPage from './pages/ValidationPage'

export const _authenticationApiClient = new AuthenticationApiClient()
export const _userApiClient = new UserApiClient()

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<MenuPage/>}/>
          <Route path='/validation' element={<ValidationPage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
