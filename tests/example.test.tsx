import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

describe("example test", () => {
  it("renders a greeting", () => {
    render(<Greeting name="World" />);
    expect(screen.getByText("Hello, World")).toBeInTheDocument();
  });
});
