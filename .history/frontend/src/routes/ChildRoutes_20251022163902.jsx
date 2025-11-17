const ChildRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<ChildApp />}>
          <Route index element={<ChildDashboard />} />
          <Route path="profile" element={<ChildProfilePage />} />
          <Route path="browse/:type" element={<CartoonModules />} />
          <Route path="series/:seriesSlug" element={<SeriesDetail />} />
          <Route path="browse/singles/:videoSlug" element={<VideoWatch />} />
          <Route
            path="series/:seriesSlug/video/:videoSlug"
            element={<VideoWatch />}
          />

          {/* ✅ MODULE ROUTES */}
          <Route path="module">
            <Route index element={<VideoModules />} />

            {/* ✅ SERIES MODULE FLOW */}
            <Route path="series/:seriesSlug" element={<SeriesQuizDetail />} />
            <Route
              path="series/:seriesSlug/introduction"
              element={<ModuleIntroduction />}
            />
            <Route
              path="series/:seriesSlug/page1/:videoId?"
              element={<ModulePage1 />}
            />
            <Route
              path="series/:seriesSlug/quiz/:videoId?"
              element={<ModuleQuiz />}
            />
            <Route
              path="series/:seriesSlug/completion/:videoId?"
              element={<ModuleCompletion />}
            />

            {/* ✅ SINGLE VIDEO MODULE FLOW - UPDATED */}
            <Route
              path="single/:videoId/introduction"
              element={<ModuleIntroduction />}
            />
            <Route path="single/:videoId/page1" element={<ModulePage1 />} />
            <Route path="single/:videoId/quiz" element={<ModuleQuiz />} />
            <Route
              path="single/:videoId/completion"
              element={<ModuleCompletion />}
            />
          </Route>

          {/* BACKWARD COMPATIBLE ROUTES */}
          <Route path="singles" element={<CartoonModules />} />
          <Route path="singles/:videoId" element={<VideoWatch />} />

          {/* OTHER PAGES */}
          <Route path="notifications" element={<NotificationPageChild />} />
          <Route path="history" element={<HistoryPageChild />} />
          <Route path="help-support" element={<HelpPageChild />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
