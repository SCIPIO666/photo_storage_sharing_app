import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Uploads from './pages/Uploads';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<h1 className="text-3xl font-bold text-center mt-20">Find Your Memories</h1>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/uploads" element={<Uploads />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;