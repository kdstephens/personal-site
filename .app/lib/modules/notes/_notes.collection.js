export const _notesCollection = () => (collectionApi) => {
  return collectionApi.getFilteredByGlob("../**/*.md").sort((a, b) => {
    const nameA = a.fileSlug;
    const nameB = b.fileSlug;
    return nameA.localeCompare(nameB);
  });
};
