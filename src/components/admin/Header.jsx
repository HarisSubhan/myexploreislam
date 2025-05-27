import { useState } from "react";
import {
    Navbar,
    Container,
    Nav,
    Button,
    Dropdown,
    ButtonGroup,
} from "react-bootstrap";
import { Sun, Moon, Person } from "react-bootstrap-icons";

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("bg-dark");
        document.body.classList.toggle("text-light");
    };

    return (
        <Navbar
            bg={darkMode ? "dark" : "light"}
            variant={darkMode ? "dark" : "light"}
            expand="lg"
            className="shadow-sm px-3"
        >
            <Container fluid>
                <Navbar.Brand href="/admin/dashboard" className="fw-bold">
                    Explore Islam
                </Navbar.Brand>

                <Nav className="ms-auto align-items-center gap-3">
                    {/* Theme Toggle Button */}
                    <Button
                        variant={darkMode ? "light" : "outline-dark"}
                        onClick={toggleTheme}
                        title="Toggle Theme"
                    >
                        {darkMode ? <Sun /> : <Moon />}
                    </Button>

                    {/* User Dropdown */}
                    <Dropdown as={ButtonGroup}>
                        <Button variant={darkMode ? "light" : "outline-dark"}>
                            <Person />
                        </Button>
                        <Dropdown.Toggle
                            split
                            variant={darkMode ? "light" : "outline-dark"}
                            id="dropdown-split-basic"
                        />
                        <Dropdown.Menu align="end">
                            <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
                            <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>

    );
};

export default Header;
