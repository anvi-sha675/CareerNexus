import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { SocketProvider } from "../context/SocketContext";

/** Wraps a component with every context provider + router the app needs, for realistic isolated tests. */
export function renderWithProviders(ui, { route = "/", ...options } = {}) {
  function Wrapper({ children }) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SocketProvider>
              <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
            </SocketProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
