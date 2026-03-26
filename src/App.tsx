// App.tsx
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import Welcome from './pages/WelcomPage';
import Register from './pages/RegisterPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<MainPage />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  )
}

export default App;