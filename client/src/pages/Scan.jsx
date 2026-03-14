import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { locationsAPI } from '../api';

const Scan = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = searchParams.get('token');
  const audioRef = useRef(null);
  
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [unlockedLocationId, setUnlockedLocationId] = useState(null);

  useEffect(() => {
    if (!user) {
      if (token) {
        localStorage.setItem('pendingScanToken', token);
      }
      navigate('/login?redirect=/scan');
      return;
    }

    const pendingToken = localStorage.getItem('pendingScanToken');
    const scanTokenValue = token || pendingToken;
    
    if (!scanTokenValue) {
      setStatus('error');
      setMessage('Không tìm thấy mã QR hợp lệ');
      return;
    }

    const performScan = async () => {
      try {
        const res = await locationsAPI.scan(scanTokenValue);
        setStatus('success');
        setMessage(res.data.message);
        setUnlockedLocationId(res.data.location.id);
        localStorage.removeItem('pendingScanToken');
        
        // Store for animation on landing page
        localStorage.setItem('justUnlockedId', res.data.location.id);
        
        // Play sound
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        
        setShowPopup(true);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Quét QR thất bại');
      }
    };

    performScan();
  }, [token, user]);

  const handleGoToMap = () => {
    setShowPopup(false);
    window.location.href = '/?unlock=true';
  };

  if (status === 'loading') {
    return (
      <div className="scan-result">
        <div className="loading">Đang xử lý...</div>
      </div>
    );
  }

  return (
    <div className="scan-result">
      <audio ref={audioRef} src="/unlocked.mp3" />
      
      {/* Popup when unlock success */}
      {showPopup && (
        <div className="unlock-popup-overlay">
          <div className="unlock-popup">
            <div className="unlock-icon">🎉</div>
            <h2>UNLOCKED!</h2>
            <p className="unlock-message">{message}</p>
            <p className="unlock-location">Location {unlockedLocationId}</p>
            <button onClick={handleGoToMap} className="btn-primary btn-unlock">
              XEM MAP
            </button>
          </div>
        </div>
      )}

      {/* Original UI for error or other cases */}
      {!showPopup && (
        <div className={`result-card ${status}`}>
          {status === 'success' ? (
            <>
              <div className="result-icon">✓</div>
              <h2>Thành công!</h2>
            </>
          ) : (
            <>
              <div className="result-icon">✗</div>
              <h2>Thất bại</h2>
            </>
          )}
          <p>{message}</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary">
            Quay lại game
          </button>
        </div>
      )}
    </div>
  );
};

export default Scan;
