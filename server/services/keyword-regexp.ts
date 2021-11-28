export const keywordRegexp = (keywords: string[]) => {
  return new RegExp(`(${keywords.map((keyword) => keyword.toLowerCase()).join("|")})`);
};
