import { useMemo } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dropdownItems = useMemo(
    () => [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/settings", label: "Settings" },
      { type: "divider" },
      { href: "#/logout", label: "Logout", onClick: logoutHandler },
    ],
    [logoutHandler]
  );

  const userButtons = useMemo(
    () => [
      { label: "Child", onClick: () => {} },
      { label: "Parent", onClick: () => {} },
    ],
    []
  );

  return (
    <Navbar expand="lg" className="shadow-sm px-3">
      <Container fluid>
        <Nav className="ms-auto align-items-center gap-3">
          <div>
            {userButtons.map((button, index) => (
              <Button
                key={button.label}
                className={index > 0 ? "ms-2" : ""}
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))}
          </div>

          {/* User Dropdown */}
          <Dropdown as={ButtonGroup}>
            <Button>
              <Person />
            </Button>
            <Dropdown.Toggle split id="dropdown-split-basic" />
            <Dropdown.Menu align="end">
              {dropdownItems.map((item, index) =>
                item.type === "divider" ? (
                  <Dropdown.Divider key={`divider-${index}`} />
                ) : (
                  <Dropdown.Item
                    key={item.href}
                    href={item.href}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
