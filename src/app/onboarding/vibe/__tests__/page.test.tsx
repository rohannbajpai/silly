import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import VibePage from '../page';
import { useOnboardingStore } from '@/lib/store';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the store
jest.mock('@/lib/store', () => ({
  useOnboardingStore: jest.fn(),
}));

describe('VibePage', () => {
  const mockPush = jest.fn();
  const mockGoToNextStep = jest.fn();
  const mockSetVibe = jest.fn();
  const mockGoToPreviousStep = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup store mock
    (useOnboardingStore as jest.Mock).mockReturnValue({
      vibe: null,
      setVibe: mockSetVibe,
      error: null,
      currentStep: 1,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });
  });

  it('renders the vibe page correctly', () => {
    render(<VibePage />);

    // Check if the title and description are rendered
    expect(screen.getByText('Choose Your Vibe')).toBeInTheDocument();
    expect(screen.getByText(/Select the energy level that best matches/)).toBeInTheDocument();

    // Check if all vibe options are rendered
    expect(screen.getByText('Casual')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();
    expect(screen.getByText('Intense')).toBeInTheDocument();

    // Check if the next button is disabled initially
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('enables the next button when a vibe is selected', () => {
    // Setup store with a selected vibe
    (useOnboardingStore as jest.Mock).mockReturnValue({
      vibe: 'casual',
      setVibe: mockSetVibe,
      error: null,
      currentStep: 1,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<VibePage />);

    // Check if the next button is enabled
    expect(screen.getByTestId('next-button')).not.toBeDisabled();
  });

  it('calls setVibe when a vibe is selected', () => {
    render(<VibePage />);

    // Select a vibe
    const casualOption = screen.getByText('Casual');
    fireEvent.click(casualOption);

    // Check if setVibe was called with the correct value
    expect(mockSetVibe).toHaveBeenCalledWith('casual');
  });

  it('redirects to the focus page when next is clicked', () => {
    // Setup store with a selected vibe
    (useOnboardingStore as jest.Mock).mockReturnValue({
      vibe: 'casual',
      setVibe: mockSetVibe,
      error: null,
      currentStep: 1,
      goToNextStep: mockGoToNextStep,
    });

    render(<VibePage />);

    // Click the next button
    fireEvent.click(screen.getByTestId('next-button'));

    // Check if goToNextStep was called
    expect(mockGoToNextStep).toHaveBeenCalled();

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/onboarding/focus');
  });

  it('shows error message when error is present', () => {
    // Setup store with an error
    (useOnboardingStore as jest.Mock).mockReturnValue({
      vibe: null,
      setVibe: mockSetVibe,
      error: 'Please select a vibe',
      currentStep: 1,
      goToNextStep: mockGoToNextStep,
    });

    render(<VibePage />);

    // Check if error message is displayed
    expect(screen.getByTestId('error-alert')).toHaveTextContent('Please select a vibe');
  });

  it('redirects to focus page if vibe is already selected', async () => {
    // Setup store with a selected vibe
    (useOnboardingStore as jest.Mock).mockReturnValue({
      vibe: 'casual',
      setVibe: mockSetVibe,
      error: null,
      currentStep: 1,
      goToNextStep: mockGoToNextStep,
    });

    render(<VibePage />);

    // Wait for the redirect to happen
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/focus');
    });
  });
}); 