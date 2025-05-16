import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import EventsPage from './EventsPage';  // Import the new page
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import UserProfile from './UserProfile'
import MyBookings from './MyBookings';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/events" element={<EventsPage />} />   {/* New route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
