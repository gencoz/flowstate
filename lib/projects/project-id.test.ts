import { describe, expect, it } from "vitest";
import { createProjectId } from "./project-id";

describe("createProjectId", () => {
  it("creates a stable URL-safe id", () => {
    expect(createProjectId("  Product Launch  ", [])).toBe("product-launch");
    expect(createProjectId("Café redesign", [])).toBe("cafe-redesign");
  });

  it("adds a suffix when an id already exists", () => {
    expect(createProjectId("Product", ["product", "product-2"])).toBe("product-3");
  });
});
