import { Nav, Navbar } from 'react-bootstrap';
import { HouseDoor, People, Gear } from 'react-bootstrap-icons';

const Sidebar = () => {
    return (
        <div
            style={{
                height: '100vh',
                width: '250px',
                backgroundColor: '#fff', // Bootstrap red
                color: '#000',
                paddingTop: '20px',
                position: 'fixed',
                left: 0,
                top: 0,
            }}
        >
            <Navbar.Brand href="/admin" className="fw-bold gap-2 d-flex align-items-center px-3">
                Explore Islam
            </Navbar.Brand>
            <Nav className="flex-column px-3">
                <Nav.Link href="/admin" className="text-dark d-flex align-items-center gap-2">
                    <HouseDoor /> Home
                </Nav.Link>
                <Nav.Link href="/dashboard" className="text-dark d-flex align-items-center gap-2">
                    <HouseDoor /> Course Category
                </Nav.Link>
                <Nav.Link href="/dashboard" className="text-dark d-flex align-items-center gap-2">
                    <HouseDoor /> Courses
                </Nav.Link>
                <Nav.Link href="/dashboard" className="text-dark d-flex align-items-center gap-2">
                    <HouseDoor /> Subscriptions
                </Nav.Link>
                <Nav.Link href="/dashboard" className="text-dark d-flex align-items-center gap-2">
                    <HouseDoor /> Transections
                </Nav.Link>
                <Nav.Link href="/users" className="text-dark d-flex align-items-center gap-2">
                    <People /> User List
                </Nav.Link>
                <Nav.Link href="/settings" className="text-dark d-flex align-items-center gap-2">
                    <Gear /> Profile
                </Nav.Link>
                <Nav.Link href="/settings" className="text-dark d-flex align-items-center gap-2">
                    <Gear /> Settings
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
