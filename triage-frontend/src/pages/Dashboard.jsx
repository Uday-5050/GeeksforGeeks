import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { getStoredAuth, logout } from '../services/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const session = getStoredAuth();
    if (!session || !session.user) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const stats = [
    { title: 'Total Consultations', value: '1,234', icon: '🏥', color: 'purple' },
    { title: 'Emergency Cases', value: '45', icon: '🚨', color: 'red' },
    { title: 'Pending Reviews', value: '89', icon: '⏰', color: 'orange' },
    { title: 'Resolved Cases', value: '1,100', icon: '✅', color: 'green' }
  ];

  const recentCases = [
    { id: 1, patient: 'John Doe', age: 45, condition: 'Chest Pain', severity: 'EMERGENCY', time: '5 mins ago' },
    { id: 2, patient: 'Jane Smith', age: 28, condition: 'Fever', severity: 'URGENT', time: '15 mins ago' },
    { id: 3, patient: 'Mike Johnson', age: 62, condition: 'Headache', severity: 'GP', time: '1 hour ago' },
    { id: 4, patient: 'Sarah Williams', age: 35, condition: 'Cold', severity: 'SELF_CARE', time: '2 hours ago' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error', err);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-dashboard">
            <svg viewBox="0 0 100 100" className="logo-svg-dashboard">
              <path d="M50 20 L65 35 L50 50 L35 35 Z" fill="white" opacity="0.9"/>
              <path d="M35 35 L50 50 L35 65 L20 50 Z" fill="white" opacity="0.7"/>
              <path d="M50 50 L65 65 L50 80 L35 65 Z" fill="white" opacity="0.9"/>
              <path d="M65 35 L80 50 L65 65 L50 50 Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <h2>HEALTHCARE</h2>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'overview' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>
          <button 
            className={activeTab === 'patients' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('patients')}
          >
            <span className="nav-icon">👥</span>
            <span>Patients</span>
          </button>
          <button 
            className={activeTab === 'triage' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('triage')}
          >
            <span className="nav-icon">🏥</span>
            <span>Triage</span>
          </button>
          <button 
            className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('reports')}
          >
            <span className="nav-icon">📈</span>
            <span>Reports</span>
          </button>
          <button 
            className={activeTab === 'settings' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Medical Dashboard</h1>
            <p className="header-subtitle">Welcome back, Dr. Admin</p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <div className="avatar">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="35" r="15" fill="#7c6fd1"/>
                  <path d="M30 70 Q30 50 50 50 Q70 50 70 70 L65 80 L35 80 Z" fill="#7c6fd1"/>
                </svg>
              </div>
              <div className="user-info">
                <span className="user-name">Dr. Admin</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
              <div className="stat-trend">↗ +12%</div>
            </div>
          ))}
        </section>

        {/* Recent Cases */}
        <section className="content-section">
          <div className="section-header">
            <h2>Recent Triage Cases</h2>
            <button className="view-all-btn">View All →</button>
          </div>

          <div className="cases-table">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Condition</th>
                  <th>Severity</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((case_) => (
                  <tr key={case_.id}>
                    <td className="patient-cell">
                      <div className="patient-avatar">
                        {case_.patient.charAt(0)}
                      </div>
                      <span>{case_.patient}</span>
                    </td>
                    <td>{case_.age}</td>
                    <td>{case_.condition}</td>
                    <td>
                      <span className={`severity-badge severity-${case_.severity.toLowerCase().replace('_', '-')}`}>
                        {case_.severity}
                      </span>
                    </td>
                    <td className="time-cell">{case_.time}</td>
                    <td>
                      <button className="action-btn">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <button className="action-card purple-action" onClick={() => navigate('/')}>
              <span className="action-icon">➕</span>
              <span className="action-text">New Triage</span>
            </button>
            <button className="action-card orange-action" onClick={() => navigate('/demo')}>
              <span className="action-icon">🎮</span>
              <span className="action-text">Demo Mode</span>
            </button>
            <button className="action-card green-action">
              <span className="action-icon">📊</span>
              <span className="action-text">Reports</span>
            </button>
            <button className="action-card red-action">
              <span className="action-icon">🚨</span>
              <span className="action-text">Emergencies</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
