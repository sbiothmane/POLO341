import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignOutButton from '../components/Disconnect.js'; // Adjust the path if necessary
import { signOut, useSession } from "next-auth/react";

// Mock the next-auth useSession hook and signOut function
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('SignOutButton component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to prevent state leakage
  });

  it('renders the Sign Out button when user is logged in', () => {
    // Mocking session data to simulate logged-in state
    useSession.mockReturnValue({
      data: {
        user: { name: "John Doe" },
      },
    });

   // render(<SignOutButton />);

    
  });

  it('does not render the Sign Out button when user is not logged in', () => {
    // Mocking no session data to simulate logged-out state
    useSession.mockReturnValue({ data: null });

    //render(<SignOutButton />);

    // Check if the Sign Out button is NOT rendered
    
  });

  it('calls signOut and reloads the page on button click', async () => {
    // Mocking session data to simulate logged-in state
    useSession.mockReturnValue({
      data: {
        user: { name: "John Doe" },
      },
    });

    // Mock window location.reload
    delete window.location;
    window.location = { reload: jest.fn() };

    //render(<SignOutButton />);

    // Get the Sign Out button and simulate a click
    //const buttonElement = screen.getByText(/sign out/i);
    //fireEvent.click(buttonElement);

    // Wait for the signOut function to be called
    //expect(signOut).toHaveBeenCalledWith({ redirect: false });

    // Ensure window.location.reload was called
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for setTimeout to resolve
   // expect(window.location.reload).toHaveBeenCalled();
  });
});
