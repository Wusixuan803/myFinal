import './Loading.css';

function Loading({ children }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{children || 'Loading...'}</p>
    </div>
  );
}

export default Loading;
