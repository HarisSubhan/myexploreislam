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
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate(); 

   

      const logoutHandler = () => {
        localStorage.removeItem("token");         
        navigate("/login");
    };


    return (
        <Navbar
            bg={darkMode ? "dark" : "light"}
            variant={darkMode ? "dark" : "light"}
            expand="lg"
            className="shadow-sm px-3"
        >
            <Container fluid>
                {/* <Navbar.Brand href="/admin/dashboard" className="fw-bold">
                    Explore Islam
                </Navbar.Brand> */}

                <Nav className="ms-auto align-items-center gap-3">
                

                    <div className="">
                        <Button>
                            child
                        </Button>
                        <Button>
                            Parent
                        </Button>
                    </div>

                    {/* User Dropdown */}
                    <Dropdown as={ButtonGroup}>
                        <Button 
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
                            <Dropdown.Item onClick={logoutHandler} href="#/logout">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>

    );
};

export default Header;
