// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { FaTachometerAlt, FaUsers, FaChild, FaVideo, FaListAlt, FaBook, FaBlog, FaTags, FaCog } from 'react-icons/fa';

// const Sidebar = () => {
//   return (
//     <div className="bg-danger text-white vh-100 p-3" style={{ width: '240px' }}>
//       <h4 className="mb-4">📘 Explore Islam</h4>
//       <Nav className="flex-column">
//         <Nav.Link href="#" className="text-white"><FaTachometerAlt /> Dashboard</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaUsers /> Manage Parents</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaChild /> Manage Children</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaVideo /> Manage Videos</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaListAlt /> Manage Quizzes</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaBook /> Manage Assignm.</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaBlog /> Manage Blogs</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaTags /> Categories</Nav.Link>
//         <Nav.Link href="#" className="text-white"><FaCog /> Settings</Nav.Link>
//       </Nav>
//     </div>
//   )


import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: 'hsl(232deg 17.24% 17.06%)', color: '#fff' }} className="p-3">
      <h4 className="mb-4"> Explore Islam</h4>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/dashboard" className="text-white">📊 Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/admin/parents" className="text-white">👪 Manage Parents</Nav.Link>
        <Nav.Link as={Link} to="/admin/children" className="text-white">👶 Manage Children</Nav.Link>

        <Nav.Link as={Link} to="/admin/videos" className="text-white">🎬 Manage Videos</Nav.Link>
        <Nav.Link as={Link} to="/admin/manage-videos/add" className="text-white ms-3">➕ Add Video</Nav.Link>

        <Nav.Link as={Link} to="/admin/quizzes" className="text-white">📝 Manage Quizzes</Nav.Link>
        <Nav.Link as={Link} to="/admin/assignments" className="text-white">📚 Manage Assignments</Nav.Link>
        <Nav.Link as={Link} to="/admin/manage-books" className="text-white">📚 Manage Books</Nav.Link>

        <Nav.Link as={Link} to="/admin/blogs" className="text-white">✍️ Manage Blogs</Nav.Link>
        <Nav.Link as={Link} to="/admin/subscriptions" className="text-white">💳 Subscriptions</Nav.Link>
        <Nav.Link as={Link} to="/admin/categories" className="text-white">📂 Categories</Nav.Link>
        <Nav.Link as={Link} to="/admin/settings" className="text-white">⚙️ Settings</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
