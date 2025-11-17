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
} from "react-icons/fa";
import {
  addChildApi,
  getChildrenByParentIdApi,
} from "../../../services/parentApi";

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [submitting, setSubmitting] = useState(false);

  // Get parent ID from your auth context or localStorage
  const getParentId = () => {
    // Replace this with how you get the parent ID in your app
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user.parentId;
  };

  // Load children data from API
  const loadChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      const parentId = getParentId();

      if (!parentId) {
        throw new Error("Parent ID not found. Please log in again.");
      }

      const response = await getChildrenByParentIdApi(parentId);

      // Transform API response to match expected format
      const transformedChildren =
        response.data?.map((child) => ({
          id: child.id || child._id,
          name: child.name || child.fullName,
          age: child.age,
        
          progress: calculateOverallProgress(child),
          avatar: child.avatar || child.profileImage,
          subjects: child.subjects || [],
          certificates: child.certificates || [],
          email: child.email,
          username: child.username,
        })) || [];

      setChildren(transformedChildren);
    } catch (err) {
      console.error("Failed to load children:", err);
      setError(err.message || "Failed to load children");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall progress from subjects
  const calculateOverallProgress = (child) => {
    if (!child.subjects || child.subjects.length === 0) return 0;
    const total = child.subjects.reduce(
      (sum, subject) => sum + (subject.score || 0),
      0
    );
    return Math.round(total / child.subjects.length);
  };

  // Load children on component mount
  useEffect(() => {
    loadChildren();
  }, []);

  // Add new child via API
  const addChild = async (childData) => {
    try {
      setSubmitting(true);
      const response = await addChildApi(childData);

      // Transform and add new child to state
      const newChild = {
        id: response.data.id || response.data._id,
        name: childData.name,
        age: childData.age,
     
        progress: 0,
        avatar: childData.avatar,
        subjects: [],
        certificates: [],
        email: childData.email,
        username: childData.username,
      };

      setChildren((prev) => [newChild, ...prev]);
      setShowForm(false);
      return response;
    } catch (err) {
      console.error("Failed to add child:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Update existing child (for now, we'll handle this locally since we don't have update API)
  const updateChild = (childData) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childData.id ? { ...child, ...childData } : child
      )
    );
    setShowForm(false);
    setEditing(null);
  };

  // Combined upsert function
  const upsertChild = async (childData) => {
    try {
      if (childData.id) {
        // Update existing child (local for now)
        updateChild(childData);
      } else {
        // Add new child via API
        await addChild(childData);
      }
    } catch (err) {
      throw err; // Re-throw to handle in form
    }
  };

  

  // Remove child (local state only for now)
  const removeChild = (id) => {
    const toDelete = children.find((c) => c.id === id);
    if (!toDelete) return;
    setDeletedBackup(toDelete);
    setChildren((prev) => prev.filter((c) => c.id !== id));
    setShowUndoToast(true);

    setTimeout(() => {
      setShowUndoToast(false);
      setDeletedBackup(null);
    }, 10000);
  };

  const undoDelete = () => {
    if (deletedBackup) {
      setChildren((prev) => [deletedBackup, ...prev]);
      setDeletedBackup(null);
      setShowUndoToast(false);
    }
  };

  // Open progress modal
  const openProgress = (child) => {
    setSelectedChild(child);
    setShowProgress(true);
  };

 

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
                placeholder="Search by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search children"
              />
            </InputGroup>
          </div>
        </div>

        <div className="d-flex gap-2 align-items-center">
    

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
            disabled={submitting}
          >
            <FaPlus className="me-1" />
            {submitting ? "Adding..." : "Add Child"}
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
                        {child.age} yrs}
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
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeChild(child.id)}
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
          submitting={submitting}
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
            <Button size="sm" variant="outline-primary" onClick={undoDelete}>
              <FaUndo className="me-1" />
              Undo
            </Button>
          </Toast.Body>
        </Toast>
      </div>
    </Container>
  );
};

/* ChildFormModal: Add/Edit child with API integration */
const ChildFormModal = ({ show, onHide, onSave, editing, submitting }) => {
  const [form, setForm] = useState({
    id: editing?.id ?? null,
    name: editing?.name ?? "",
    age: editing?.age ?? "",
    grade: editing?.grade ?? "",
    email: editing?.email ?? "",
    username: editing?.username ?? "",
    password: "",
    progress: editing?.progress ?? 0,
    avatar: editing?.avatar ?? null,
  });
  const [avatarPreview, setAvatarPreview] = useState(editing?.avatar ?? null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setForm({
      id: editing?.id ?? null,
      name: editing?.name ?? "",
      age: editing?.age ?? "",
      grade: editing?.grade ?? "",
      email: editing?.email ?? "",
      username: editing?.username ?? "",
      password: "",
      progress: editing?.progress ?? 0,
      avatar: editing?.avatar ?? null,
    });
    setAvatarPreview(editing?.avatar ?? null);
    setErrors({});
    setApiError(null);
  }, [editing]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setForm((f) => ({ ...f, avatar: url }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name required";
    if (!form.age || isNaN(Number(form.age))) err.age = "Valid age required";
    if (!form.grade) err.grade = "Grade required";
    if (!form.email) err.email = "Email required";
    if (!form.username) err.username = "Username required";
    if (!editing && !form.password) err.password = "Password required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      // Prepare data for API
      const submitData = {
        name: form.name,
        age: Number(form.age),
        grade: form.grade,
        email: form.email,
        username: form.username,
        ...(form.password && { password: form.password }),
        ...(form.avatar && { avatar: form.avatar }),
      };

      await onSave(editing ? { ...form, ...submitData } : submitData);
    } catch (err) {
      console.error("Form submission error:", err);
      setApiError(err.message || "Failed to save child. Please try again.");
    }
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
          {apiError && (
            <Alert variant="danger" className="mb-3">
              {apiError}
            </Alert>
          )}

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
              />
              <Form.Text className="text-muted">
                Optional. JPG/PNG only.
              </Form.Text>
            </div>
          </div>

          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Child Full Name *</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Child's User Name *</Form.Label>
                <Form.Control
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Password {!editing && "*"}</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  isInvalid={!!errors.password}
                  placeholder={editing ? "Leave blank to keep current" : ""}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  isInvalid={!!errors.age}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.age}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Grade *</Form.Label>
                <Form.Control
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  isInvalid={!!errors.grade}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.grade}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : form.id ? "Update" : "Create"}
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
              {child.age} yrs {child.grade && ``}
            </small>
            <div className="mt-2">
              <Badge bg={child.progress > 75 ? "success" : "warning"}>
                {child.progress}%
              </Badge>
            </div>
          </Col>

          <Col md={8}>
            <h6>Subject Progress</h6>
            {child.subjects?.length > 0 ? (
              child.subjects.map((s) => (
                <div key={s.name} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <small>{s.name}</small>
                    <small>{s.score}%</small>
                  </div>
                  <ProgressBar now={s.score} />
                </div>
              ))
            ) : (
              <p className="text-muted">No subject data available.</p>
            )}
          </Col>
        </Row>
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
