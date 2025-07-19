
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdQuiz, MdAssignment, MdSubscriptions, MdDashboard  } from "react-icons/md";
import { FaUserFriends, FaChild, FaVideo, FaBookOpen, FaBlogger } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: 'black', color: '#fff', height: '100vh' }} className="p-3">
      <h4 className="mb-4"> Explore Islam</h4>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/dashboard" className="text-white"><MdDashboard /> Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/admin/parents" className="text-white"><FaUserFriends /> Manage Parents</Nav.Link>
        <Nav.Link as={Link} to="/admin/children" className="text-white"><FaChild /> Manage Children</Nav.Link>

        <Nav.Link as={Link} to="/admin/videos" className="text-white"><FaVideo /> Manage Videos</Nav.Link>
        {/* <Nav.Link as={Link} to="/admin/manage-videos/add" className="text-white ms-3">➕ Add Video</Nav.Link> */}

        <Nav.Link as={Link} to="/admin/quizzes" className="text-white"><MdQuiz /> Manage Quizzes</Nav.Link>
        <Nav.Link as={Link} to="/admin/assignments" className="text-white"><MdAssignment /> Manage Assignments</Nav.Link>
        <Nav.Link as={Link} to="/admin/manage-books" className="text-white"><FaBookOpen /> Manage Books</Nav.Link>

        <Nav.Link as={Link} to="/admin/blogs" className="text-white"><FaBlogger /> Manage Blogs</Nav.Link>
        <Nav.Link as={Link} to="/admin/subscriptions" className="text-white"><MdSubscriptions /> Subscriptions</Nav.Link>
        <Nav.Link as={Link} to="/admin/categories" className="text-white"><BiSolidCategory /> Categories</Nav.Link>
        <Nav.Link as={Link} to="/admin/settings" className="text-white"><IoSettings /> Settings</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
