import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import Home from "./components/Home";
import Category from "./components/Category";
import Book from "./components/Book";
import UserInfo from "./components/UserInfo";
import Seller from "./components/Seller";
import VerifiedSeller from "./components/VerifiedSeller";
import Recommend from "./components/Recommend";
import About from "./components/About";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Safety from "./components/Safety";
import AdminBooks from './components/AdminBooks';
import Search from "./components/Search";
import Auth from './components/Auth';
import Chat from './components/Chat';
import ContactUs from './components/ContactUs';
import Refund from './components/Refund';
import TermsConditions from './components/TermsConditions';
import { useEffect, useState } from "react";
import { useAuth } from './context/AuthContext';

const API_URL = 'http://localhost:5007/api/books';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const response = await fetch('http://localhost:5007/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/auth');
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          navigate('/auth');
        }
      }
    };

    verifyToken();
  }, [navigate]);

  const updateUser = (newUserData) => {
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/auth" />;
    }
    return children;
  };

  return (
    <div id="navigation">
      <SideNav userId={user?.id} userPic={user?.image} />
      <div id="mainContent">
        <TopNav />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home books={books} />} />
          <Route path="category" element={<Category books={books} />} />
          <Route path="category/:catId" element={<Category books={books} />} />
          <Route path="about" element={<About />} />
          <Route path="about/terms&condition" element={<Terms />} />
          <Route path="about/privacy-policy" element={<Privacy />} />
          <Route path="about/safety-remarks" element={<Safety />} />
          <Route path="search/:option/:search" element={<Search books={books} />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/TermsandConditions" element={<TermsConditions />} />
          <Route path="/RefundAndCancellation" element={<Refund />} />

          <Route path="book/:bookId" element={
            <PrivateRoute>
              <Book books={books} wishlist={user?.wishlist || []} user={user?.id} />
            </PrivateRoute>
          } />
          
          <Route path="seller" element={
            <PrivateRoute>
              {!user?.verified ? 
                <Seller 
                  verified={user?.verified} 
                  user={user?.id} 
                  updateUser={updateUser}
                /> :
                <Navigate to="/seller/verified" replace />
              }
            </PrivateRoute>
          } />
          
          <Route path="seller/verified" element={
            <PrivateRoute>
              <VerifiedSeller 
                verified={user?.verified} 
                userId={user?.id} 
                user={user}
              />
            </PrivateRoute>
          } />
          
          <Route path="recommend" element={
            <PrivateRoute>
              <Recommend />
            </PrivateRoute>
          } />
          
          <Route path="/admin/books" element={
            <PrivateRoute>
              <AdminBooks />
            </PrivateRoute>
          } />
          
          <Route path="user/:userId" element={
            <PrivateRoute>
              <UserInfo books={books} currUser={user?.id} userData={user} />
            </PrivateRoute>
          } />
          
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat userId={user?.id} userData={user} />
            </PrivateRoute>
          } />
          <Route path="/chat/:sellerId" element={
            <PrivateRoute>
              <Chat userId={user?.id} userData={user} />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
