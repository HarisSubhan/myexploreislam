const handleCardClick = (module) => {
  const moduleSlug = createSlug(module.title);

  if (module.type === "series") {
    navigate(`/child/series/${moduleSlug}`);
  } else {
    // WRONG - navigates to browse page instead of video player
    navigate(`/child/browse/singles`, {
      state: {
        moduleId: module.id,
        moduleName: module.title,
      },
    });
  }
};
