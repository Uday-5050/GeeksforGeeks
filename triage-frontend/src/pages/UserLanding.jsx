import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLanding.css';

function UserLanding() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI Symptom Checker',
      description: 'Get instant AI-powered health assessments based on your symptoms',
      color: '#667eea',
      path: '/user-dashboard'
    },
    {
      icon: '📊',
      title: 'Health Analytics',
      description: 'Track your health history and monitor symptom patterns over time',
      color: '#764ba2',
      path: '/user-dashboard?tab=history'
    },
    {
      icon: '📚',
      title: 'Health Library',
      description: 'Access comprehensive health information and medical resources',
      color: '#f093fb',
      path: '/user-dashboard?tab=health-info'
    },
    {
      icon: '🎙️',
      title: 'Voice Input',
      description: 'Describe your symptoms naturally using voice recognition',
      color: '#10b981',
      path: '/user-dashboard'
    },
    {
      icon: '🌍',
      title: 'Multi-Language Support',
      description: 'Access healthcare in your preferred language',
      color: '#3b82f6',
      path: '/user-dashboard?tab=settings'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your health data is encrypted and completely confidential',
      color: '#ef4444',
      path: '/user-dashboard?tab=settings'
    }
  ];

  return (
    <div className="user-landing-container">
      {/* Animated Background */}
      <div className="landing-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">
          <img src="/curemind-logo.png" alt="CureMind Logo" className="logo-image" />
          <span className="logo-text">CureMind</span>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span className="welcome-text">Welcome back,</span>
            <span className="user-name">{userName}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            CureMind - Your Personal Health Assistant
          </h1>
          <p className="hero-subtitle">
            Symptom Analysis, Personalized Cures • Data-Driven Health Insights
          </p>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <h2 className="section-title">Explore Our Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                onClick={() => navigate(feature.path)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon" style={{ background: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">95%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-number">6</div>
            <div className="stat-label">Languages</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-number">100%</div>
            <div className="stat-label">Secure</div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <h2 className="cta-title">Ready to Check Your Symptoms?</h2>
            <p className="cta-text">
              Our AI-powered system will analyze your symptoms and provide personalized health recommendations
            </p>
            <button className="cta-button" onClick={() => navigate('/user-dashboard')}>
              <span>🚀</span> Start Health Check
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 CureMind. Symptom Analysis, Personalized Cures - Data-Driven Health Insights.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}

export default UserLanding;
