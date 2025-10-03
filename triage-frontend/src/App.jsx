import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Demo from './pages/Demo';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function Navigation() {
  const location = useLocation();
  
  // Don't show navigation on login page or dashboard
  if (location.pathname === '/login' || location.pathname === '/dashboard') {
    return null;
  }
  
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/demo" className={location.pathname === '/demo' ? 'active' : ''}>
            Demo
          </Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            About
          </Link>
        </li>
        <li>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
