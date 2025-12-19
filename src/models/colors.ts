export const COLOR_MAP: Record<string, string> = {
  red: "#FF3B3B",
  blue: "#3B8BFF",
  green: "#00D66F",
  white: "white",
};

export const getColorHex = (colorName: string): string => {
  return COLOR_MAP[colorName] || colorName;
};
