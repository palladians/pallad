import { test } from "vitest"

test("concatenation", () => {
  const str1 = "Hello"
  const str2 = "World"
  expect(`${str1} ${str2}`).toBe("Hello World")
})
