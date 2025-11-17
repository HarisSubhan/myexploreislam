import React, { useState } from "react";
import "./LearningReports.css";
import PropTypes from "prop-types";

const LearningReports = () => {
  const [activeTab, setActiveTab] = useState("subjects");
  const [selectedPeriod, setSelectedPeriod] = useState("current-semester");

  // Mock data - replace with actual API calls
  const subjects = [
    {
      id: "1",
      name: "Mathematics",
      grade: "A-",
      strength: "Algebra and problem-solving",
      weakness: "Geometry proofs",
      progress: 85,
    },
    {
      id: "2",
      name: "Science",
      grade: "B+",
      strength: "Experimental design",
      weakness: "Chemical equations",
      progress: 78,
    },
    {
      id: "3",
      name: "English",
      grade: "A",
      strength: "Creative writing",
      weakness: "Grammar rules",
      progress: 92,
    },
    {
      id: "4",
      name: "History",
      grade: "B",
      strength: "Historical analysis",
      weakness: "Memorizing dates",
      progress: 70,
    },
  ];

  const assignments = [
    {
      id: "1",
      title: "Algebra Final Project",
      subject: "Mathematics",
      dueDate: "2024-01-15",
      status: "completed",
      score: 45,
      maxScore: 50,
    },
    {
      id: "2",
      title: "Chemistry Lab Report",
      subject: "Science",
      dueDate: "2024-01-20",
      status: "in-progress",
    },
    {
      id: "3",
      title: "World War II Essay",
      subject: "History",
      dueDate: "2024-01-10",
      status: "overdue",
    },
    {
      id: "4",
      title: "Shakespeare Analysis",
      subject: "English",
      dueDate: "2024-01-25",
      status: "completed",
      score: 48,
      maxScore: 50,
    },
  ];

  const reportCard = {
    studentName: "John Smith",
    studentId: "STU2024001",
    period: "Fall 2024 Semester",
    subjects: subjects,
    overallGrade: "A-",
    comments:
      "Excellent progress this semester. Shows strong analytical skills and consistent improvement in all subjects.",
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { class: "status-completed", text: "Completed" },
      "in-progress": { class: "status-in-progress", text: "In Progress" },
      overdue: { class: "status-overdue", text: "Overdue" },
    };

    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleEmailReport = () => {
    // In a real application, this would integrate with an email service
    alert("Report card has been emailed successfully!");
  };

  const completedAssignments = assignments.filter(
    (a) => a.status === "completed"
  );
  const inProgressAssignments = assignments.filter(
    (a) => a.status === "in-progress"
  );
  const overdueAssignments = assignments.filter((a) => a.status === "overdue");

  return (
    <div className="learning-reports">
      <div className="reports-header">
        <h1>Learning Reports</h1>
        <div className="header-controls">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="current-week">Current Week</option>
            <option value="current-month">Current Month</option>
            <option value="current-semester">Current Semester</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
      </div>

      <div className="reports-tabs">
        <button
          className={`tab-button ${activeTab === "subjects" ? "active" : ""}`}
          onClick={() => setActiveTab("subjects")}
        >
          Subjects & Progress
        </button>
        <button
          className={`tab-button ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
        <button
          className={`tab-button ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          Report Card
        </button>
      </div>

      <div className="reports-content">
        {activeTab === "subjects" && (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <div key={subject.id} className="subject-card">
                <div className="subject-header">
                  <h3>{subject.name}</h3>
                  <span className="grade-badge">{subject.grade}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {subject.progress}% Complete
                </div>
                <div className="strengths-weaknesses">
                  <div className="strength">
                    <strong>Strength:</strong> {subject.strength}
                  </div>
                  <div className="weakness">
                    <strong>Area for Improvement:</strong> {subject.weakness}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="assignments-section">
            <div className="assignments-overview">
              <div className="overview-card completed">
                <h4>Completed</h4>
                <span className="count">{completedAssignments.length}</span>
              </div>
              <div className="overview-card in-progress">
                <h4>In Progress</h4>
                <span className="count">{inProgressAssignments.length}</span>
              </div>
              <div className="overview-card overdue">
                <h4>Overdue</h4>
                <span className="count">{overdueAssignments.length}</span>
              </div>
            </div>

            <div className="assignments-list">
              <h3>All Assignments</h3>
              {assignments.map((assignment) => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-info">
                    <h4>{assignment.title}</h4>
                    <span className="subject-tag">{assignment.subject}</span>
                    <span className="due-date">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="assignment-status">
                    {getStatusBadge(assignment.status)}
                    {assignment.score && assignment.maxScore && (
                      <span className="score">
                        {assignment.score}/{assignment.maxScore}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div className="report-card-section">
            <div className="report-card-actions">
              <button
                onClick={handlePrintReport}
                className="action-button print"
              >
                Print Report
              </button>
              <button
                onClick={handleEmailReport}
                className="action-button email"
              >
                Email Report
              </button>
            </div>

            <div className="report-card printable">
              <div className="report-header">
                <h2>Academic Report Card</h2>
                <div className="student-info">
                  <p>
                    <strong>Student:</strong> {reportCard.studentName}
                  </p>
                  <p>
                    <strong>ID:</strong> {reportCard.studentId}
                  </p>
                  <p>
                    <strong>Period:</strong> {reportCard.period}
                  </p>
                </div>
              </div>

              <div className="report-subjects">
                <h3>Subject Performance</h3>
                <table className="subjects-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Grade</th>
                      <th>Progress</th>
                      <th>Strengths</th>
                      <th>Areas for Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportCard.subjects.map((subject) => (
                      <tr key={subject.id}>
                        <td>{subject.name}</td>
                        <td className="grade-cell">{subject.grade}</td>
                        <td>
                          <div className="progress-bar-small">
                            <div
                              className="progress-fill"
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                          {subject.progress}%
                        </td>
                        <td>{subject.strength}</td>
                        <td>{subject.weakness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="report-summary">
                <h3>Overall Performance</h3>
                <div className="summary-content">
                  <div className="overall-grade">
                    <strong>Overall Grade:</strong> {reportCard.overallGrade}
                  </div>
                  <div className="teacher-comments">
                    <strong>Comments:</strong>
                    <p>{reportCard.comments}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for better development experience
LearningReports.propTypes = {
  // Add any props if needed in the future
};

export default LearningReports;
