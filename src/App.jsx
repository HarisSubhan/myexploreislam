// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import AuthRoutes from "./routes/AuthRoutes";
// import AdminRoutes from "./routes/AdminRoutes";
// import ParentRoutes from "./routes/ParentRoutes";
// import ChildRoutes from "./routes/ChildRoutes";
// import HomePage from "./pages/SharedPortal/pages/HomePage";

// function App() {
//   const isAuthenticated = () => {
//     return localStorage.getItem("authToken") !== null;
//   };

//   const getRole = () => {
//     return localStorage.getItem("userRole");
//   };

//   const RequireAuth = ({ children, role }) => {
//     if (!isAuthenticated()) {
//       return <Navigate to="/login" />;
//     }
//     if (role && getRole() !== role) {
//       return <Navigate to="/unauthorized" />;
//     }
//     return children;
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes - Only Homepage */}
//         <Route path="/" element={<HomePage />} />

//         {/* Auth Routes (Login, Register, etc.) */}
//         {AuthRoutes.map((route) => (
//           <Route key={route.path} path={route.path} element={route.element} />
//         ))}

//         {/* Protected Routes */}

//         <Route
//           path="/parent/*"
//           element={
//             <RequireAuth role="parent">
//               <ParentRoutes />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/child/*"
//           element={
//             <RequireAuth role="child">
//               <ChildRoutes />
//             </RequireAuth>
//           }
//         />

//         {/* Fallback Route */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// tempory unprotect
// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ParentRoutes from "./routes/ParentRoutes";
import ChildRoutes from "./routes/ChildRoutes";
import HomePage from "./pages/SharedPortal/pages/HomePage";

function App() {
  // Temporarily disable authentication checks
  const isAuthenticated = () => true;
  const getRole = () => localStorage.getItem("userRole") || "admin";

  const RequireAuth = ({ children, role }) => {
    // Just return children without any checks for now
    return children;
  };

  const renderRoutes = (routes) => {
    return routes.map((route) => {
      const element = route.requiresAuth ? (
        <RequireAuth role={route.requiredRole}>{route.element}</RequireAuth>
      ) : (
        route.element
      );

      if (route.children) {
        return (
          <Route key={route.path} path={route.path} element={element}>
            {route.children.map((childRoute) => {
              const childElement = childRoute.requiresAuth ? (
                <RequireAuth role={childRoute.requiredRole}>
                  {childRoute.element}
                </RequireAuth>
              ) : (
                childRoute.element
              );

              return (
                <Route
                  key={childRoute.path || childRoute.index}
                  index={childRoute.index}
                  path={childRoute.path}
                  element={childElement}
                />
              );
            })}
          </Route>
        );
      }
      return <Route key={route.path} path={route.path} element={element} />;
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {AuthRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {/* Protected Routes */}
        <Route path="/parent/*" element={<ParentRoutes />} />
        <Route path="/child/*" element={<ChildRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
