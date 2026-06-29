import "@testing-library/jest-dom/vitest";

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
