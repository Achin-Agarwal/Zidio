
import './App.css';
import AuthForm from './AuthForm';
import UserDashboard from './userdashboard';
import AdminDashboard from './admindashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/userdashboard" element={<UserDashboard />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
    </Routes>
   </Router>
  );
}

export default App;
