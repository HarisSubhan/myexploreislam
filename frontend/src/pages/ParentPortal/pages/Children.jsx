// components/Children.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
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
  FaEdit,
  FaUserCircle,
  FaSearch,
  FaSortAmountDown,
  FaUndo,
  FaChild,
  FaEnvelope,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";
import {
  addChildApi,
  getChildrenByParentIdApi,
  deleteChildApi,
  updateChildApi
} from "../../../services/parentApi";
import ChildFormModal from "../../../components/parent/ChildFormModal";

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletedBackup, setDeletedBackup] = useState(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);


  const getParentId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user.parentId;
  };

  
  const loadChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      const parentId = getParentId();

      if (!parentId) {
        throw new Error("Parent ID not found. Please log in again.");
      }

      const response = await getChildrenByParentIdApi(parentId);

      
      const transformedChildren =
        response.data?.map((child) => ({
          id: child.id || child._id,
          name: child.name || child.fullName,
          age: child.age,
          avatar: child.avatar || child.profileImage,
          subjects: child.subjects || [],
          quizzes: child.quizzes || [],
          email: child.email,
          username: child.username,
        })) || [];

      setChildren(transformedChildren);
    } catch (err) {
      setError(err.message || "Failed to load children");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    loadChildren();
  }, []);

  
  const addChild = async (childData) => {
    try {
      setSubmitting(true);
      await addChildApi(childData);
      setShowForm(false);
      await loadChildren();
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  
  const updateChild = async (childData) => {
    try {
      setSubmitting(true);
      const { id, ...updateData } = childData;
      await updateChildApi(id, updateData);
      setChildren((prev) =>
        prev.map((child) =>
          child.id === id ? { ...child, ...updateData } : child
        )
      );
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Combined upsert function
  const upsertChild = async (childData) => {
    try {
      if (childData.id) {
        await updateChild(childData);
      } else {
        await addChild(childData);
      }
    } catch (err) {
      throw err;
    }
  };

  // Remove child with API integration
  const removeChild = async (id) => {
    const toDelete = children.find((c) => c.id === id);
    if (!toDelete) return;

    try {
      setDeletingId(id);
      const parentId = getParentId();
      await deleteChildApi(id, parentId);
      setChildren((prev) => prev.filter((c) => c.id !== id));
      setDeletedBackup(toDelete);
      setShowUndoToast(true);
      setTimeout(() => {
        setShowUndoToast(false);
        setDeletedBackup(null);
      }, 10000);
    } catch (err) {
      setError(err.message || "Failed to delete child");
    } finally {
      setDeletingId(null);
    }
  };

  const undoDelete = () => {
    if (deletedBackup) {
      setChildren((prev) => [deletedBackup, ...prev]);
      setDeletedBackup(null);
      setShowUndoToast(false);
    }
  };

  // Edit child
  const editChild = (child) => {
    setEditing(child);
    setShowForm(true);
  };

  // Helpers: search/filter/sort
  const filtered = children
    .filter((c) => {
      if (!query) return true;
      return c.name.toLowerCase().includes(query.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Loading placeholder
  const renderLoadingPlaceholders = () => {
    return [1, 2, 3].map((i) => (
      <Col key={i} xs={12} md={6} lg={4} className="mb-4">
        <Card className="h-100 shadow-lg border-0">
          <Card.Body className="p-4">
            <div className="d-flex gap-3 align-items-center">
              <Placeholder as="div" animation="glow" className="rounded-circle" style={{ width: '80px', height: '80px' }}>
                <Placeholder xs={12} className="rounded-circle" style={{ height: '100%' }} />
              </Placeholder>
              <div className="flex-grow-1">
                <Placeholder as="h5" animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={4} />
                </Placeholder>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  // Empty state
  const renderEmptyState = () => (
    <Col xs={12}>
      <Card className="text-center p-5 border-0 shadow-lg bg-gradient-primary text-white">
        <Card.Body className="py-5">
          <div className="mb-4">
            <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex p-4">
              <FaChild size={48} />
            </div>
          </div>
          <h3 className="mb-3">No Children Added Yet</h3>
          <p className="mb-4 opacity-75">
            Start by adding your first child to manage their learning journey
          </p>
          <Button
            variant="light"
            size="lg"
            className="px-4"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
          >
            <FaPlus className="me-2" />
            Add First Child
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

  // Stats card
  const StatsCard = () => (
    <Card className="border-0 shadow-sm mb-4 bg-gradient-info text-white">
      <Card.Body className="p-4">
        <Row className="g-4">
          <Col xs={6} md={3}>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                <FaChild size={24} />
              </div>
              <h4 className="mb-1">{children.length}</h4>
              <small className="opacity-75">Total Children</small>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                <FaBook size={24} />
              </div>
              <h4 className="mb-1">
                {children.reduce((acc, child) => acc + (child.subjects?.length || 0), 0)}
              </h4>
              <small className="opacity-75">Total Videos</small>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                <FaGraduationCap size={24} />
              </div>
              <h4 className="mb-1">
                {children.reduce((acc, child) => acc + (child.quizzes?.length || 0), 0)}
              </h4>
              <small className="opacity-75">Quizzes Taken</small>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                <FaUserCircle size={24} />
              </div>
              <h4 className="mb-1">{filtered.length}</h4>
              <small className="opacity-75">Showing</small>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // Child Card Component
  const ChildCard = ({ child, onEdit, onDelete, deletingId }) => (
    <Col xs={12} md={6} lg={4} className="mb-4">
      <Card className="h-100 shadow-lg border-0 hover-lift">
        <Card.Body className="p-4 d-flex flex-column">
          {/* Header with Avatar and Actions */}
          <div className="d-flex gap-3 align-items-start mb-4">
            <div className="position-relative">
              <Image
                src={child.avatar || "/default-avatar.png"}
                roundedCircle
                width={80}
                height={80}
                className="object-fit-cover border border-4 border-light shadow-sm"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <Badge 
                bg="success" 
                className="position-absolute bottom-0 end-0 rounded-circle border border-2 border-white"
                style={{ width: '20px', height: '20px' }}
              >
                &nbsp;
              </Badge>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="fw-bold text-dark mb-1">{child.name}</h5>
                  <Badge bg="outline-primary" text="primary" className="fs-6">
                    Age: {child.age}
                  </Badge>
                </div>
                <div className="dropdown">
                  <Button
                    variant="link"
                    className="text-muted p-0 border-0"
                    id={`dropdown-${child.id}`}
                  >
                    ⋮
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Child Details */}
          <div className="mb-4">
            {child.email && (
              <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                <FaEnvelope size={14} />
                <small>{child.email}</small>
              </div>
            )}
            {child.subjects && child.subjects.length > 0 && (
              <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                <FaBook size={14} />
                <small>{child.subjects.length} subjects enrolled</small>
              </div>
            )}
            {child.quizzes && child.quizzes.length > 0 && (
              <div className="d-flex align-items-center gap-2 text-muted">
                <FaGraduationCap size={14} />
                <small>{child.quizzes.length} quizzes completed</small>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto d-flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-fill d-flex align-items-center justify-content-center gap-2"
              onClick={() => onEdit(child)}
            >
              <FaEdit size={14} />
              Edit Profile
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="px-3"
              onClick={() => onDelete(child.id)}
              disabled={deletingId === child.id}
            >
              <FaTrash size={14} />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          className="mb-4 border-0 shadow-sm"
          dismissible
          onClose={() => setError(null)}
        >
          <div className="d-flex align-items-center">
            <FaUserCircle className="me-2" />
            {error}
          </div>
        </Alert>
      )}

      {/* Header Section */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <FaChild size={24} className="text-white" />
              </div>
              <div>
                <h1 className="h2 fw-bold text-dark mb-1">My Children</h1>
                <p className="text-muted mb-0">Manage your children's profiles and learning journey</p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              size="lg"
              className="px-4 shadow-sm"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              disabled={submitting}
            >
              <FaPlus className="me-2" />
              {submitting ? "Adding..." : "Add Child"}
            </Button>
          </Col>
        </Row>
      </div>

      {/* Stats Card */}
      {children.length > 0 && <StatsCard />}

      {/* Search and Filter Bar */}
      {children.length > 0 && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3">
            <Row className="g-3 align-items-center">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search children by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-0 bg-light"
                    aria-label="Search children"
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="d-flex justify-content-end">
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-secondary" 
                    id="dropdown-sort"
                    className="border-0 bg-light shadow-sm"
                  >
                    <FaSortAmountDown className="me-2" />
                    Sort by: {sortBy === "name" ? "Name" : "Date"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy("name")}>
                      Name
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy("date")}>
                      Date Added
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Children Grid */}
      <Row>
        {loading ? (
          renderLoadingPlaceholders()
        ) : filtered.length === 0 ? (
          renderEmptyState()
        ) : (
          filtered.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onEdit={editChild}
              onDelete={removeChild}
              deletingId={deletingId}
            />
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

      {/* Undo Toast */}
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1100 }}>
        <Toast 
          show={showUndoToast} 
          onClose={() => setShowUndoToast(false)}
          className="border-0 shadow-lg"
        >
          <Toast.Header className="bg-light text-dark">
            <strong className="me-auto">Child Removed</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body className="d-flex align-items-center gap-3">
            <div className="bg-danger bg-opacity-10 rounded-circle p-2">
              <FaTrash className="text-danger" />
            </div>
            <div className="flex-grow-1">
              <strong>Profile deleted</strong>
              <div className="text-muted small">You can undo this action</div>
            </div>
            <Button size="sm" variant="outline-primary" onClick={undoDelete}>
              <FaUndo className="me-1" />
              Undo
            </Button>
          </Toast.Body>
        </Toast>
      </div>

      {/* Custom CSS for hover effects */}
      <style jsx>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-gradient-info {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        }
      `}</style>
    </Container>
  );
};

export default Children;