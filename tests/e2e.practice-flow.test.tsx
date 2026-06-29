import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import unit001 from "../data/jp/curriculum/units/unit_001.json";

describe("practice flow e2e", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.assign(window, {
      speechSynthesis: {
        cancel: vi.fn(),
        speak: vi.fn(),
      },
    });
  });

  it("drills a Japanese unit end to end without blank states", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    expect(screen.getByRole("heading", { name: "Unit 1: First Sentences" })).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[0].line.join(""));
    expect(screen.queryByLabelText(/image/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /show english/i }));
    expect(screen.getByText(unit001.cards[0].english)).toBeVisible();

    await user.click(screen.getByRole("button", { name: /hide english/i }));
    expect(screen.queryByText(unit001.cards[0].english)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[1].line.join(""));

    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[0].line.join(""));

    await user.click(screen.getByRole("button", { name: /^play audio$/i }));
    expect(screen.getByText(/Japanese audio|Audio queued/)).toBeVisible();

    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.queryByLabelText("Media area")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show english/i })).toBeVisible();

    await user.selectOptions(screen.getByLabelText(/card number/i), "12");
    expect(screen.getByLabelText(/card number/i)).toHaveValue("12");

    await user.click(screen.getByRole("button", { name: /mark unit complete/i }));
    expect(screen.getByText("Completed")).toBeInTheDocument();

    const saved = window.localStorage.getItem("kotoba.progress.v1");
    expect(saved).toContain('"unitId":1');
    expect(saved).toContain('"cardPositions"');

    unmount();
    render(<App />);
    expect(screen.getByRole("heading", { name: "Unit 1: First Sentences" })).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence").textContent?.length).toBeGreaterThan(0);
  });
});
