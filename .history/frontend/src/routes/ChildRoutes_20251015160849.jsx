const ChildRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<ChildApp />}>
          <Route index element={<ChildDashboard />} />
          <Route path="profile" element={<ChildProfilePage />} />
          
          {/* SINGLE MODEL (Standalone videos) */}
          <Route path="singles" element={<CartoonModules />} />
          <Route path="singles/:videoId" element={<VideoWatch />} />
          
          {/* SERIES MODEL (Structured learning path) */}
          <Route path="series" element={<VideoModules />} />
          <Route path="series/:seriesId" element={<VideoSeries />} />
          <Route path="series/:seriesId/introduction/:videoId" element={<ModuleIntroduction />} />
          <Route path="series/:seriesId/watch/:videoId" element={<VideoWatch />} />
          <Route path="series/:seriesId/page1/:videoId" element={<ModulePage1 />} />
          <Route path="series/:seriesId/quiz/:videoId" element={<ModuleQuiz />} />
          <Route path="series/:seriesId/completion/:videoId" element={<ModuleCompletion />} />

          <Route path="notifications" element={<NotificationPageChild />} />
          <Route path="history" element={<HistoryPageChild />} />
          <Route path="help-Support" element={<HelpPageChild />} />
        </Route>
      </Routes>
    </Suspense>
  );
};