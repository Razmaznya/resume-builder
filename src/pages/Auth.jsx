import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegLoading, setIsRegLoading] = useState(false);

  const handleShowRegister = () => setIsActive(true);
  const handleShowLogin = () => setIsActive(false);

  // Валидация пароля
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Пароль должен содержать не менее 8 символов';
    }
    if (!/\d/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
    return null; // нет ошибки
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setIsLoginLoading(true);

    setTimeout(() => {
      if (loginUsername && loginPassword) {
        const user = { username: loginUsername, email: `${loginUsername}@example.com` };
        login(user);
        setLoginSuccess('Успешный вход! Перенаправление...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setLoginError('Неверный логин или пароль');
      }
      setIsLoginLoading(false);
    }, 500);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setIsRegLoading(true);

    // Проверка заполнения всех полей
    if (!regUsername || !regEmail || !regPassword) {
      setRegError('Заполните все поля');
      setIsRegLoading(false);
      return;
    }

    // Проверка пароля
    const passwordError = validatePassword(regPassword);
    if (passwordError) {
      setRegError(passwordError);
      setIsRegLoading(false);
      return;
    }

    // Симуляция запроса
    setTimeout(() => {
      setRegSuccess('Регистрация прошла успешно! Перенаправление...');
      setTimeout(() => navigate('/auth'), 1000);
      setIsRegLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <Link to="/" className="home-link">
        <i className="bx bx-home"></i> На главную
      </Link>
      <div className={`auth-container ${isActive ? 'active' : ''}`}>
        {/* Форма входа */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Вход</h1>
            {loginError && <div className="error-message">{loginError}</div>}
            {loginSuccess && <div className="success-message">{loginSuccess}</div>}
            <div className="input-box">
              <input
                type="text"
                placeholder="Имя пользователя"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Пароль"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <i className="bx bx-lock-alt"></i>
            </div>
            <div className="forgot-link">
              <a href="/forgot-password">Забыли пароль?</a>
            </div>
            <button type="submit" className="btn" disabled={isLoginLoading}>
              {isLoginLoading ? 'Отправка...' : 'Войти'}
            </button>
            <p>или войти через соцсети</p>
            <div className="social-icons">
              <a href="#"><i className="bx bxl-google"></i></a>
              <a href="#"><i className="bx bxl-facebook"></i></a>
              <a href="#"><i className="bx bxl-github"></i></a>
              <a href="#"><i className="bx bxl-linkedin"></i></a>
            </div>
          </form>
        </div>

        {/* Форма регистрации */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Регистрация</h1>
            {regError && <div className="error-message">{regError}</div>}
            {regSuccess && <div className="success-message">{regSuccess}</div>}
            <div className="input-box">
              <input
                type="text"
                placeholder="Имя пользователя"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <i className="bx bx-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Пароль"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <i className="bx bx-lock-alt"></i>
            </div>
            <button type="submit" className="btn" disabled={isRegLoading}>
              {isRegLoading ? 'Отправка...' : 'Зарегистрироваться'}
            </button>
            <p>или зарегистрироваться через соцсети</p>
            <div className="social-icons">
              <a href="#"><i className="bx bxl-google"></i></a>
              <a href="#"><i className="bx bxl-facebook"></i></a>
              <a href="#"><i className="bx bxl-github"></i></a>
              <a href="#"><i className="bx bxl-linkedin"></i></a>
            </div>
          </form>
        </div>

        {/* Блок переключателя */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Здравствуйте!</h1>
            <p>Ещё нет аккаунта?</p>
            <button className="btn register-btn" onClick={handleShowRegister}>
              Регистрация
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>С возвращением!</h1>
            <p>Уже есть аккаунт?</p>
            <button className="btn login-btn" onClick={handleShowLogin}>
              Вход
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;