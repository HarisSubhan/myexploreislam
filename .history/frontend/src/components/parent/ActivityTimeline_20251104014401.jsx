// import React from "react";
// import { Card, Spinner, Badge } from "react-bootstrap";
// import { useUser } from "../../context/UserContext";


// const ActivityTimeline = ({ data, loading }) => {
//   const { parentId, user } = useUser();

//   const getActivityConfig = (action) => {
//     const configs = {
//       "Logged In": {
//         icon: "↗️",
//         color: "success",
//         variant: "success",
//         description: "Signed in to platform",
//       },
//       "Logged Out": {
//         icon: "↙️",
//         color: "secondary",
//         variant: "outline-secondary",
//         description: "Signed out from platform",
//       },
//       "Completed Quiz": {
//         icon: "📊",
//         color: "primary",
//         variant: "primary",
//         description: "Completed assessment",
//       },
//       "Started Lesson": {
//         icon: "📖",
//         color: "info",
//         variant: "info",
//         description: "Began new lesson",
//       },
//       "Completed Lesson": {
//         icon: "✅",
//         color: "success",
//         variant: "success",
//         description: "Finished lesson",
//       },
//       "Watched Video": {
//         icon: "🎥",
//         color: "purple",
//         variant: "outline-primary",
//         description: "Watched educational content",
//       },
//       "Earned Badge": {
//         icon: "🏆",
//         color: "warning",
//         variant: "warning",
//         description: "Achieved new milestone",
//       },
//     };

//     return (
//       configs[action] || {
//         icon: "●",
//         color: "dark",
//         variant: "outline-dark",
//         description: action,
//       }
//     );
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "Just now";

//     try {
//       const date = new Date(timestamp);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffMins = Math.floor(diffMs / (1000 * 60));
//       const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

//       if (diffMins < 1) return "Just now";
//       if (diffMins < 60) return `${diffMins}m ago`;
//       if (diffHours < 24) return `${diffHours}h ago`;

//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (error) {
//       return "Recently";
//     }
//   };

//   const parseMetadata = (metadata) => {
//     if (!metadata || metadata === "{}") return null;
//     try {
//       return JSON.parse(metadata);
//     } catch {
//       return null;
//     }
//   };

//   // Filter activities to show only parent's children
//   const getFilteredActivities = () => {
//     if (!data || !Array.isArray(data)) return [];

//     // If user has children data in context, filter by child IDs
//     if (user?.children && Array.isArray(user.children)) {
//       const childIds = user.children.map((child) => child.id || child.childId);
//       return data.filter(
//         (activity) => activity.child_id && childIds.includes(activity.child_id)
//       );
//     }

//     // If no children data, return all activities (fallback)
//     return data;
//   };

//   const filteredActivities = getFilteredActivities();

//   if (loading) {
//     return (
//       <Card className="shadow-sm border-0 h-100">
//         <Card.Body className="d-flex align-items-center justify-content-center">
//           <div className="text-center">
//             <Spinner animation="border" variant="primary" size="sm" />
//             <div className="mt-2 text-muted small">Loading activities...</div>
//           </div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   if (!data || data.length === 0 || filteredActivities.length === 0) {
//     return (
//       <Card className="shadow-sm border-0 h-100">
//         <Card.Header className="border-bottom bg-white py-3">
//           <h6 className="mb-0 fw-semibold">Recent Activity</h6>
//         </Card.Header>
//         <Card.Body className="d-flex align-items-center justify-content-center">
//           <div className="text-center text-muted">
//             <div className="mb-2">📊</div>
//             <p className="mb-1 small fw-medium">No activity yet</p>
//             <small>
//               {!data || data.length === 0
//                 ? "Activities will appear here"
//                 : "No activities from your children"}
//             </small>
//           </div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Card className="shadow-sm border-0 h-100">
//       <Card.Header className="border-bottom bg-white py-3">
//         <div className="d-flex justify-content-between align-items-center">
//           <h6 className="mb-0 fw-semibold">Children's Activity</h6>
//           <Badge bg="light" text="dark" className="rounded-pill">
//             {filteredActivities.length}
//           </Badge>
//         </div>
//       </Card.Header>

//       <Card.Body className="p-0">
//         <div className="activity-list">
//           {filteredActivities.map((activity, index) => {
//             const config = getActivityConfig(activity.action);
//             const metadata = parseMetadata(activity.metadata);
//             const isLast = index === filteredActivities.length - 1;

//             return (
//               <div
//                 key={activity.log_id || index}
//                 className={`activity-item d-flex p-3 ${!isLast ? "border-bottom" : ""}`}
//               >
//                 <div className="flex-shrink-0">
//                   <div
//                     className={`rounded-circle d-flex align-items-center justify-content-center bg-${config.color}-subtle`}
//                     style={{ width: "40px", height: "40px" }}
//                   >
//                     <span className={`text-${config.color} fs-6`}>
//                       {config.icon}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex-grow-1 ms-3">
//                   <div className="d-flex justify-content-between align-items-start mb-1">
//                     <div>
//                       <h6 className="mb-0 fw-semibold small">
//                         {activity.child_name || "Student"}
//                       </h6>
//                       <p className="mb-1 text-muted small">
//                         {config.description}
//                       </p>
//                     </div>
//                     <span className="text-muted small text-nowrap">
//                       {formatTime(activity.created_at)}
//                     </span>
//                   </div>

//                   {/* Metadata details */}
//                   {metadata && (
//                     <div className="mt-2">
//                       {metadata.score && (
//                         <Badge
//                           bg="success"
//                           className="me-2 rounded-pill small fw-normal"
//                         >
//                           Score: {metadata.score}%
//                         </Badge>
//                       )}
//                       {metadata.duration && (
//                         <Badge
//                           bg="outline-secondary"
//                           text="dark"
//                           className="me-2 rounded-pill small fw-normal"
//                         >
//                           {metadata.duration}m
//                         </Badge>
//                       )}
//                       {metadata.lesson && (
//                         <Badge
//                           bg="outline-info"
//                           text="dark"
//                           className="rounded-pill small fw-normal"
//                         >
//                           {metadata.lesson}
//                         </Badge>
//                       )}
//                     </div>
//                   )}

//                   {/* Action badge */}
//                   <div className="mt-2">
//                     <Badge
//                       bg={
//                         config.variant.includes("outline")
//                           ? "light"
//                           : config.variant
//                       }
//                       text={
//                         config.variant.includes("outline") ? "dark" : "white"
//                       }
//                       className="rounded-pill small fw-normal border"
//                     >
//                       {activity.action}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {filteredActivities.length > 5 && (
//           <div className="text-center py-3 border-top">
//             <small className="text-muted">
//               Showing latest {Math.min(filteredActivities.length, 10)} of{" "}
//               {filteredActivities.length} activities
//             </small>
//           </div>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default ActivityTimeline;
