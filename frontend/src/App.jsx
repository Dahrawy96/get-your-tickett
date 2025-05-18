import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import EventsPage from './EventsPage';
import EventDetails from './EventDetails';
import CreateEvent from './CreateEvent';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import UserProfile from './UserProfile';
import MyBookings from './MyBookings';
import EditEvent from './EditEvent';  // Import your new component
import AdminUsersPage from './AdminUsersPage';
import AdminEventsPage from './AdminEventsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create-event" element={<CreateEvent />} />  {/* new */}
        <Route path="/edit-event/:id" element={<EditEvent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
