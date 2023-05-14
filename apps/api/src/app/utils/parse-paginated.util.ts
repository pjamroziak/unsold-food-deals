export const parsePaginated = <T>(result: [T[], number]) => ({
  count: result[1],
  results: result[0],
});
