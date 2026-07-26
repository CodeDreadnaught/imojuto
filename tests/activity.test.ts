import { describe, expect, test } from "vitest";
import { toCsv } from "@/lib/csv";

describe("activity export", () => {
  test("escapes commas in csv values", () => {
    expect(toCsv([{ actor: "Admin", note: "Pipe, leaking" }])).toContain('"Pipe, leaking"');
  });
});
