import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';

const Landing = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unlockedLocations, setUnlockedLocations] = useState([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData) {
      setUser(JSON.parse(userData));
      if (token) {
        fetchLocations();
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchParams.get('unlock') === 'true') {
      window.history.replaceState({}, document.title, '/');
      const unlockedId = localStorage.getItem('justUnlockedId');
      if (unlockedId) {
        setNewlyUnlocked(parseInt(unlockedId));
        localStorage.removeItem('justUnlockedId');
        if (audioRef.current) audioRef.current.play().catch(() => {});
      }
      setTimeout(() => {
        if (mapRef.current) mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [searchParams]);

  const fetchLocations = async () => {
    try {
      const res = await api.get('/locations');
      const unlocked = res.data.locations.filter(loc => loc.unlocked).map(loc => loc.id);
      setUnlockedLocations(unlocked);
      const userData = localStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        userObj.unlocked_count = res.data.progress.completed;
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
      }
    } catch (err) {
      console.error('Fetch locations error:', err);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUnlockedLocations([]);
    window.location.href = '/';
  };

  return (
    <div className="page">
      <audio ref={audioRef} src="/win.mp3" />
      
      {/* HERO */}
      <section className="hero">
        <img src="/section1.png" alt="Hero" />
        <div className="hero-text-overlay">
          <p>CÓ MỘT THẾ GIỚI TỒN TẠI GIỮA ÁNH SÁNG VÀ BÓNG TỐI, NƠI RANH GIỚI CỦA THỰC TẠI</p>
          <p>DẦN TAN BIẾN. TRONG THẾ GIỚI ẤY, NHỮNG DẤU VẾT BÍ ẨN CỦA GREY D LẶNG LẼ DẪN</p>
          <p>LỐI QUA CÁC VÙNG ĐẤT CHƯA TỪNG ĐƯỢC ĐẶT CHÂN TỚI. MỖI BƯỚC ĐI SẼ MỞ RA MỘT</p>
          <p>CÁNH CỬA MỚI, MỖI MANH MỐI LẠI HÉ LỘ THÊM MỘT BÍ MẬT ĐANG NGỦ QUÊN.</p>
          <p className="hero-highlight">HÃY BƯỚC VÀO GREY DIMENSION, BẮT ĐẦU HÀNH TRÌNH CỦA</p>
          <p>BẠN VÀ KHÁM PHÁ NHỮNG ĐIỀU CHỈ DÀNH CHO NHỮNG</p>
          <p>NGƯỜI ĐỦ CAN ĐẢM TÌM KIẾM SỰ THẬT.</p>
        </div>
        {user ? (
          <div className="user-hero-actions">
            <span className="user-greeting">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <a href="/login.html" className="start-game">START</a>
        )}
      </section>

      {/* SECTION 2 - Mobile Only */}
      <img src="/section2.png" alt="Section 2" className="section-img section2-mobile" />

      {/* SECTION 3 - MAP */}
      {user ? (
        <div className="map-section" ref={mapRef}>
          <img src="/map/map_full.png" alt="Map Full" className="map-full-img" />
          <div className="map-pieces">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(id => (
              <img
                key={id}
                src={`/location/${id}.png`}
                alt={`Piece ${id}`}
                className={`map-piece ${unlockedLocations.includes(id) ? 'unlocked' : ''} ${newlyUnlocked === id ? 'highlight' : ''}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <img src="/section3.png" alt="Section 3" className="section-img" />
      )}

      {/* SECTION 4 */}
      <div className="section4-wrap">
        <img src="/section4.png" alt="Section 4" className="section-img" />
        {user ? (
          <div className="user-info-overlay">
            <p className="username">@{user.username}</p>
            <p className="progress">{user.unlocked_count || 0}/13</p>
            <p className="unlocked-text">unlocked</p>
            <p className="time-text">{formatTime(currentTime)}</p>
            <p className="date-text">{formatDate(user.created_at)}</p>
          </div>
        ) : (
          <div className="user-info-overlay">
            <p className="progress">0/13</p>
            <p className="unlocked-text">lock</p>
          </div>
        )}
      </div>

      <img src="/section5.png" alt="Section 5" className="section-img" />
      <img src="/section7.png" alt="Section 7" className="section-img" />

      <div className="video-section">
        <iframe src="https://www.youtube.com/embed/2iidlwQ-NfU" title="Video" allowFullScreen></iframe>
      </div>
    </div>
  );
};

export default Landing;
