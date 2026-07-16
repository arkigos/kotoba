import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

class MockSpeechSynthesisUtterance {
  text: string;
  lang = "";
  onend: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

Object.defineProperty(window, "SpeechSynthesisUtterance", {
  configurable: true,
  value: MockSpeechSynthesisUtterance,
});
