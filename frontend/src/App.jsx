import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import UserProfile from './UserProfile'; // import the dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/userprofile" element={<UserProfile />} /> {/* new route */}
      </Routes>
    </Router>
  );
}

export default App;
