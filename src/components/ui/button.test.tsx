// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("should render button text", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("should apply default variant attributes", () => {
    render(<Button>Submit</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
  });

  it("should apply custom variant and size", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button).toHaveAttribute("data-size", "lg");
  });

  it("should render as disabled", () => {
    render(<Button disabled>Save</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should call onClick", () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click</Button>);

    screen.getByRole("button").click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("should merge custom className", () => {
    render(<Button className="custom-class">Button</Button>);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should render as child", () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Link" });

    expect(link).toHaveAttribute("href", "/test");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
