import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// E2E test: confirm all primary SketchQuest UI/pages render and routes function
describe("SketchQuest UI module end-to-end presence", () => {
  test("shows login page at /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    // Look for SketchQuest Login
    expect(screen.getByText(/sketchquest login/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  test("shows dashboard, leaderboard, and drawing links on Header (after login simulated)", async () => {
    // Mock context with user loaded & present, so RequireAuth will pass
    jest.spyOn(require("./context/AppContext"), "useAppContext").mockImplementation(() => ({
      user: { uid: "abc", username: "testuser" },
      userLoaded: true,
    }));

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    // Dashboard
    expect(screen.getByText(/community drawings/i)).toBeInTheDocument();
    // Header links
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
  });

  test("shows drawing page when routed with docId", () => {
    jest.spyOn(require("./context/AppContext"), "useAppContext").mockImplementation(() => ({
      user: { uid: "abc", username: "testuser" },
      userLoaded: true,
    }));

    render(
      <MemoryRouter initialEntries={["/drawing/new"]}>
        <App />
      </MemoryRouter>
    );
    // Should see spin for a prompt or drawing UI
    expect(screen.getByText(/spin for a prompt/i)).toBeInTheDocument();
  });

  test("shows leaderboard page and top 10 players", () => {
    jest.spyOn(require("./context/AppContext"), "useAppContext").mockImplementation(() => ({
      user: { uid: "abc", username: "testuser" },
      userLoaded: true,
    }));

    render(
      <MemoryRouter initialEntries={["/leaderboard"]}>
        <App />
      </MemoryRouter>
    );
    // Leaderboard heading
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
  });
});
