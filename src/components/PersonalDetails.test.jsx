import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import PersonalDetails from './PersonalDetails';

describe('PersonalDetails', () => {
  it('renders personal details form', () => {
    render(<PersonalDetails />);
    
    // Check if essential form elements are present
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
  });

  it('updates input values when typed', () => {
    render(<PersonalDetails />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput.value).toBe('john@example.com');
  });

  it('validates required fields', () => {
    render(<PersonalDetails />);
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    // Check for validation messages
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
}); 