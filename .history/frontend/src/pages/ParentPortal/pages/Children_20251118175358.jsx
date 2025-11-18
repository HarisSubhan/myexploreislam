// components/Children.js
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
  deleteChildApi,
} from "../../../services/parentApi";
import ChildFormModal from "../../../components/parent/ChildFormModal";
import ProgressModal from "../../../components/ProgressModal";
import ChildCard from "../../../components/ChildCard";

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [deletedBackup, setDeletedBackup] = useState(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Get parent ID from your auth context or localStorage
  const getParentId = () => {
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

  // Update existing child
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
        updateChild(childData);
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
      console.error("Failed to delete child:", err);
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

  // Open progress modal
  const openProgress = (child) => {
    setSelectedChild(child);
    setShowProgress(true);
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
      if (sortBy === "progress") return b.progress - a.progress;
      return 0;
    });

  // Loading placeholder
  const renderLoadingPlaceholders = () => {
    return [1, 2, 3].map((i) => (
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
    ));
  };

  // Empty state
  const renderEmptyState = () => (
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
  );

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
              onViewProgress={openProgress}
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

export default Children;