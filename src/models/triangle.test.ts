import { getRowColFromId } from "./Triangle";

describe(`${getRowColFromId.name}`, () => {
  it("parses row and column from triangle ID", () => {
    const id = "t-3-5";
    const [row, col] = getRowColFromId(id);
    expect(row).toBe(3);
    expect(col).toBe(5);
  });
});
