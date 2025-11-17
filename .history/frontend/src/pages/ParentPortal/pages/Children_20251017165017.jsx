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


const sampleChildren = [
  {
    id: 1,
    name: "Ali",
    age: 8,
    avatar: null,
    subjects: [
      { name: "Math", score: 88 },
      { name: "Science", score: 82 },
      { name: "English", score: 90 },
    ],
  },
  {
    id: 2,
    name: "Sara",
    age: 10,
    avatar: null,
    subjects: [
      { name: "Math", score: 94 },
      { name: "Science", score: 89 },
      { name: "English", score: 93 },
    ],
  },
];

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name"); // or "progress"
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // child being edited
  const [showProgress, setShowProgress] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [deletedBackup, setDeletedBackup] = useState(null); // store for undo
  const [showUndoToast, setShowUndoToast] = useState(false);

  // load sample data (simulate API)
  useEffect(() => {
    setTimeout(() => {
      setChildren(sampleChildren);
      setLoading(false);
    }, 500);
  }, []);

  // Helpers: search/filter/sort
  const filtered = children
    .filter((c) => {
      if (!query) return true;
      return c.name.toLowerCase().includes(query.toLowerCase());
    })
    .filter((c) => (gradeFilter === "All" ? true : c.grade === gradeFilter))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return b.progress - a.progress;
      return 0;
    });

  // Add or update child (optimistic local update)
  const upsertChild = (child) => {
    if (child.id) {
      setChildren((prev) => prev.map((c) => (c.id === child.id ? child : c)));
    } else {
      child.id = Date.now();
      setChildren((prev) => [child, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  // remove with undo support
  const removeChild = (id) => {
    const toDelete = children.find((c) => c.id === id);
    if (!toDelete) return;
    setDeletedBackup(toDelete);
    setChildren((prev) => prev.filter((c) => c.id !== id));
    setShowUndoToast(true);

    // optional: auto-clear backup after 10s (undo window)
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

  // open progress modal
  const openProgress = (child) => {
    setSelectedChild(child);
    setShowProgress(true);
  };

  // UI for available grades (for filter dropdown)
  const gradeOptions = [
    "All",
    ...Array.from(new Set(children.map((c) => c.grade))),
  ];

  return (
    <Container fluid className="py-4">
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
          >
            <FaPlus className="me-1" /> Add Child
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
                  Add a child to get started. You can also import or sync later.
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
                        {child.age} yrs • {child.grade}
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

/* ChildFormModal: Add/Edit child with avatar preview & simple validation */
const ChildFormModal = ({ show, onHide, onSave, editing }) => {
  const [form, setForm] = useState({
    id: editing?.id ?? null,
    name: editing?.name ?? "",
    age: editing?.age ?? "",
    grade: editing?.grade ?? "",
    progress: editing?.progress ?? 0,
    avatar: editing?.avatar ?? null,
    subjects: editing?.subjects ?? [],
    certificates: editing?.certificates ?? [],
  });
  const [avatarPreview, setAvatarPreview] = useState(editing?.avatar ?? null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      id: editing?.id ?? null,
      name: editing?.name ?? "",
      age: editing?.age ?? "",
      grade: editing?.grade ?? "",
      progress: editing?.progress ?? 0,
      avatar: editing?.avatar ?? null,
      subjects: editing?.subjects ?? [],
      certificates: editing?.certificates ?? [],
    });
    setAvatarPreview(editing?.avatar ?? null);
    setErrors({});
  }, [editing]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setForm((f) => ({ ...f, avatar: url })); // for demo: store preview url
    // NOTE: in real app upload the file to server and store returned URL
    // Remember to revokeObjectURL when appropriate
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name required";
    if (!form.age || isNaN(Number(form.age))) err.age = "Valid age required";
    if (!form.grade) err.grade = "Grade required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // cast progress to number
    onSave({ ...form, progress: Number(form.progress) });
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
          <div className="d-flex gap-3 align-items-center mb-3">
            {avatarPreview ? (
              <Image src={avatarPreview} roundedCircle width={64} height={64} />
            ) : (
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 64, height: 64, fontWeight: 700 }}
              >
                {form.name?.charAt(0) ?? <FaUserCircle />}
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
                <Form.Label>Child Full Name</Form.Label>
                <Form.Control
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
                <Form.Label>Child's User Name</Form.Label>
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
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
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
                <Form.Label>Password</Form.Label>
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

          <Form.Group className="mb-2">
            <Form.Label>Age</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {form.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

/* ProgressModal: detailed view for a child (subjects, recent quizzes, certificates) */
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
              {child.age} yrs • {child.grade}
            </small>
            <div className="mt-2">
              <Badge bg={child.progress > 75 ? "success" : "warning"}>
                {child.progress}%
              </Badge>
            </div>
          </Col>

          <Col md={8}>
            <h6>Video Watch Time</h6>
            {child.subjects?.map((s) => (
              <div key={s.name} className="mb-2">
                <div className="d-flex justify-content-between">
                  <small>{s.name}</small>
                  <small>{s.score}%</small>
                </div>
                <ProgressBar now={s.score} />
              </div>
            ))}
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
