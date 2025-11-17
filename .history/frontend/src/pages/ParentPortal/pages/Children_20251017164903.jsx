// Children.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Toast,
  Image,
  Badge,
  Placeholder,
  Dropdown,
  Alert,
} from "react-bootstrap";
import {
  FaPlus,
  FaTrash,
  FaChartLine,
  FaEdit,
  FaUserCircle,
  FaSearch,
  FaSortAmountDown,
  FaUndo,
  FaExclamationTriangle,
} from "react-icons/fa";


// API service functions
const childApi = {
  // Get children for current parent
  getChildren: async (parentId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/parent/children/${parentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch children");
    }

    return response.json();
  },

  // Add new child
  addChild: async (childData) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/parent/add-child", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(childData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add child");
    }

    return response.json();
  },

  // Update child
  updateChild: async (childId, childData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/parent/child/${childId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update child");
    }

    return response.json();
  },

  // Delete child
  deleteChild: async (childId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/parent/child/${childId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete child");
    }

    return response.json();
  },
};

const Children = () => {
  const { user } = useUser();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  // UI states
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [deletedBackup, setDeletedBackup] = useState(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Load children from API
  const loadChildren = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await childApi.getChildren(user.id);

      // Transform API data to match our component structure
      const transformedChildren =
        data.children?.map((child) => ({
          id: child.id,
          name: child.name,
          username: child.username,
          age: child.age,
          email: child.email,
          grade: child.grade || "Grade 1", // Default if not provided
          progress: child.progress || Math.floor(Math.random() * 100), // Default progress
          avatar: child.avatar || null,
          subjects: child.subjects || [
            { name: "Math", score: Math.floor(Math.random() * 30) + 70 },
            { name: "Science", score: Math.floor(Math.random() * 30) + 70 },
            { name: "English", score: Math.floor(Math.random() * 30) + 70 },
          ],
          certificates: child.certificates || [],
        })) || [];

      setChildren(transformedChildren);
    } catch (err) {
      console.error("Error loading children:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadChildren();
    }
  }, [user?.id]);

  // Helpers: search/filter/sort
  const filtered = children
    .filter((c) => {
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.username.toLowerCase().includes(query.toLowerCase())
      );
    })
    .filter((c) => (gradeFilter === "All" ? true : c.grade === gradeFilter))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return b.progress - a.progress;
      return 0;
    });

  // Add or update child via API
  const upsertChild = async (childData) => {
    if (!user?.id) {
      setError("No parent user found");
      return;
    }

    try {
      setApiLoading(true);
      setError(null);

      if (childData.id) {
        // Update existing child
        const { id, ...updateData } = childData;
        await childApi.updateChild(id, updateData);
      } else {
        // Add new child
        const newChildData = {
          ...childData,
          parent_id: user.id,
        };
        await childApi.addChild(newChildData);
      }

      // Reload children to get updated data
      await loadChildren();
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Error saving child:", err);
      setError(err.message);
    } finally {
      setApiLoading(false);
    }
  };

  // Remove child with undo support
  const removeChild = async (id) => {
    const toDelete = children.find((c) => c.id === id);
    if (!toDelete) return;

    try {
      setApiLoading(true);
      await childApi.deleteChild(id);

      // Store for undo and update local state
      setDeletedBackup(toDelete);
      setChildren((prev) => prev.filter((c) => c.id !== id));
      setShowUndoToast(true);

      // Auto-clear backup after 10s
      setTimeout(() => {
        setShowUndoToast(false);
        setDeletedBackup(null);
      }, 10000);
    } catch (err) {
      console.error("Error deleting child:", err);
      setError(err.message);
    } finally {
      setApiLoading(false);
    }
  };

  const undoDelete = async () => {
    if (!deletedBackup || !user?.id) return;

    try {
      setApiLoading(true);
      // Re-add the child via API
      const { id, ...childData } = deletedBackup;
      await childApi.addChild({
        ...childData,
        parent_id: user.id,
      });

      // Reload children
      await loadChildren();
      setDeletedBackup(null);
      setShowUndoToast(false);
    } catch (err) {
      console.error("Error undoing delete:", err);
      setError(err.message);
    } finally {
      setApiLoading(false);
    }
  };

  // Open progress modal
  const openProgress = (child) => {
    setSelectedChild(child);
    setShowProgress(true);
  };

  // UI for available grades
  const gradeOptions = [
    "All",
    ...Array.from(new Set(children.map((c) => c.grade).filter(Boolean))),
  ];

  return (
    <Container fluid className="py-4">
      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          className="mb-3"
          dismissible
          onClose={() => setError(null)}
        >
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {/* Header + Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div className="d-flex gap-5 align-items-center">
          <div>
            <h2 className="fw-bold mb-1">👨‍👧 Manage Children</h2>
            <small className="text-muted">
              Create profiles, track progress and view reports.
            </small>
          </div>
          <div>
            <InputGroup className="me-5">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Search by name or username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search children"
              />
            </InputGroup>
          </div>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-grade">
              {gradeFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {gradeOptions.map((g) => (
                <Dropdown.Item key={g} onClick={() => setGradeFilter(g)}>
                  {g}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
              <FaSortAmountDown className="me-2" />
              {sortBy === "name" ? "Name" : "Progress"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortBy("name")}>
                Name
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("progress")}>
                Progress
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            disabled={apiLoading}
          >
            <FaPlus className="me-1" />
            {apiLoading ? "Loading..." : "Add Child"}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <Row>
        {loading ? (
          // Placeholder loading states
          [1, 2, 3].map((i) => (
            <Col key={i} xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex gap-3 align-items-center mb-3">
                    <Placeholder as="div" animation="glow">
                      <Placeholder xs={2} />
                    </Placeholder>
                    <div>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={4} />
                      </Placeholder>
                    </div>
                  </div>
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={12} />
                  </Placeholder>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : filtered.length === 0 ? (
          <Col xs={12}>
            <Card className="text-center p-4">
              <Card.Body>
                <FaUserCircle size={48} className="text-muted mb-2" />
                <h5>No children found</h5>
                <p className="text-muted">
                  {children.length === 0
                    ? "Add a child to get started. You can also import or sync later."
                    : "No children match your search criteria."}
                </p>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditing(null);
                  }}
                  disabled={apiLoading}
                >
                  ➕ Add Child
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filtered.map((child) => (
            <Col key={child.id} xs={12} md={6} lg={4} className="mb-4">
              <Card
                className="h-100 shadow-sm border-0 rounded-3"
                style={{ transition: "transform .15s", cursor: "default" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ width: 56, height: 56 }}>
                      {child.avatar ? (
                        <Image
                          src={child.avatar}
                          roundedCircle
                          width={56}
                          height={56}
                        />
                      ) : (
                        <div
                          className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 56, height: 56, fontWeight: 700 }}
                        >
                          {child.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="ms-3 flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="mb-0">{child.name}</h5>
                        <Badge
                          bg={
                            child.progress > 75
                              ? "success"
                              : child.progress > 50
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {child.progress}%
                        </Badge>
                      </div>
                      <small className="text-muted">
                        @{child.username} • {child.age} yrs • {child.grade}
                      </small>
                    </div>
                  </div>

                  {/* Small stats row */}
                  <div className="d-flex gap-2 mb-3">
                    <Badge bg="info" className="text-dark">
                      Quizzes: {child.subjects?.length ?? 0}
                    </Badge>
                    <Badge bg="light" className="text-dark">
                      Videos: {child.certificates?.length ?? 0}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Overall Progress</small>
                      <small className="text-muted">{child.progress}%</small>
                    </div>
                    <ProgressBar
                      now={child.progress}
                      variant={child.progress > 75 ? "success" : "warning"}
                      animated
                    />
                  </div>

                  <div className="mt-auto d-flex justify-content-between">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openProgress(child)}
                    >
                      <FaChartLine className="me-1" /> Progress
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => {
                        setEditing(child);
                        setShowForm(true);
                      }}
                      disabled={apiLoading}
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeChild(child.id)}
                      disabled={apiLoading}
                    >
                      <FaTrash className="me-1" /> Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Add / Edit Modal */}
      {showForm && (
        <ChildFormModal
          show={showForm}
          onHide={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={upsertChild}
          editing={editing}
          loading={apiLoading}
        />
      )}

      {/* Progress Modal */}
      {selectedChild && (
        <ProgressModal
          show={showProgress}
          onHide={() => {
            setShowProgress(false);
            setSelectedChild(null);
          }}
          child={selectedChild}
        />
      )}

      {/* Undo Toast */}
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1100 }}>
        <Toast show={showUndoToast} onClose={() => setShowUndoToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Profile removed</strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body className="d-flex align-items-center gap-2">
            <div>Child removed. </div>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={undoDelete}
              disabled={apiLoading}
            >
              <FaUndo className="me-1" />
              {apiLoading ? "Processing..." : "Undo"}
            </Button>
          </Toast.Body>
        </Toast>
      </div>
    </Container>
  );
};

/* ChildFormModal: Add/Edit child with form validation */
const ChildFormModal = ({ show, onHide, onSave, editing, loading }) => {
  const [form, setForm] = useState({
    id: editing?.id ?? null,
    name: editing?.name ?? "",
    username: editing?.username ?? "",
    email: editing?.email ?? "",
    password: "",
    age: editing?.age ?? "",
    grade: editing?.grade ?? "Grade 1",
    progress: editing?.progress ?? 0,
    avatar: editing?.avatar ?? null,
  });
  const [avatarPreview, setAvatarPreview] = useState(editing?.avatar ?? null);
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setForm({
      id: editing?.id ?? null,
      name: editing?.name ?? "",
      username: editing?.username ?? "",
      email: editing?.email ?? "",
      password: "",
      age: editing?.age ?? "",
      grade: editing?.grade ?? "Grade 1",
      progress: editing?.progress ?? 0,
      avatar: editing?.avatar ?? null,
    });
    setAvatarPreview(editing?.avatar ?? null);
    setErrors({});
    setConfirmPassword("");
  }, [editing]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Please select an image file" }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Image must be less than 5MB" }));
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setForm((f) => ({ ...f, avatar: url }));
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.username.trim()) err.username = "Username is required";
    if (!form.email.trim()) err.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Email is invalid";

    if (!editing?.id) {
      // Only validate password for new children
      if (!form.password) err.password = "Password is required";
      if (form.password.length < 6)
        err.password = "Password must be at least 6 characters";
      if (form.password !== confirmPassword)
        err.confirmPassword = "Passwords do not match";
    }

    if (!form.age || isNaN(Number(form.age)) || form.age < 3 || form.age > 18) {
      err.age = "Please enter a valid age between 3 and 18";
    }

    if (!form.grade) err.grade = "Grade is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Prepare data for API - don't send password for edits unless it's changed
    const submitData = { ...form };
    if (editing?.id && !submitData.password) {
      delete submitData.password;
    }

    onSave(submitData);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="child-form-title"
    >
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title id="child-form-title">
            {form.id ? "Edit Child" : "Add Child"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Avatar Upload */}
          <div className="d-flex gap-3 align-items-center mb-3">
            {avatarPreview ? (
              <Image src={avatarPreview} roundedCircle width={64} height={64} />
            ) : (
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 64, height: 64, fontWeight: 700 }}
              >
                {form.name?.charAt(0) || <FaUserCircle />}
              </div>
            )}

            <div>
              <Form.Label className="mb-1">Profile Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFile}
                isInvalid={!!errors.avatar}
              />
              <Form.Text className="text-muted">
                Optional. JPG/PNG only, max 5MB.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.avatar}
              </Form.Control.Feedback>
            </div>
          </div>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  isInvalid={!!errors.name}
                  placeholder="Enter child's full name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  isInvalid={!!errors.username}
                  placeholder="Enter username"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              isInvalid={!!errors.email}
              placeholder="Enter email address"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {editing?.id
                    ? "New Password (leave blank to keep current)"
                    : "Password *"}
                </Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  isInvalid={!!errors.password}
                  placeholder={
                    editing?.id ? "Enter new password" : "Enter password"
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              {!editing?.id && (
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Confirm password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  min="3"
                  max="18"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  isInvalid={!!errors.age}
                  placeholder="Enter age"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.age}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Grade *</Form.Label>
                <Form.Select
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  isInvalid={!!errors.grade}
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.grade}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : form.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

/* ProgressModal: detailed view for a child */
const ProgressModal = ({ show, onHide, child }) => {
  if (!child) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      aria-labelledby="progress-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="progress-modal">Progress — {child.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={4} className="text-center">
            {child.avatar ? (
              <Image
                src={child.avatar}
                roundedCircle
                width={100}
                height={100}
              />
            ) : (
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 100, height: 100, fontSize: 32 }}
              >
                {child.name.charAt(0)}
              </div>
            )}
            <h5 className="mt-2">{child.name}</h5>
            <small className="text-muted">
              @{child.username} • {child.age} yrs • {child.grade}
            </small>
            <div className="mt-2">
              <Badge bg={child.progress > 75 ? "success" : "warning"}>
                Overall: {child.progress}%
              </Badge>
            </div>
          </Col>

          <Col md={8}>
            <h6>Subject Performance</h6>
            {child.subjects?.map((subject) => (
              <div key={subject.name} className="mb-2">
                <div className="d-flex justify-content-between">
                  <small>{subject.name}</small>
                  <small>{subject.score}%</small>
                </div>
                <ProgressBar
                  now={subject.score}
                  variant={
                    subject.score > 85
                      ? "success"
                      : subject.score > 70
                        ? "warning"
                        : "danger"
                  }
                />
              </div>
            ))}
          </Col>
        </Row>

        {child.certificates && child.certificates.length > 0 && (
          <div className="mt-4">
            <h6>Certificates & Achievements</h6>
            <div className="d-flex flex-wrap gap-2">
              {child.certificates.map((cert, index) => (
                <Badge key={index} bg="success" className="p-2">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Children;
