import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Введите email');
      return;
    }
    // Имитация отправки
    setTimeout(() => {
      setMessage('Инструкции по восстановлению пароля отправлены на ваш email.');
      setError('');
    }, 500);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-box">
        <h1>Забыли пароль?</h1>
        <p>Введите ваш email, и мы отправим инструкции для восстановления пароля.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="bx bx-envelope"></i>
          </div>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button type="submit" className="btn">Отправить</button>
          <div className="back-link">
            <Link to="/auth">Вернуться к входу</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;