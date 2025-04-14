import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import TimePage from '../page';
import { useOnboardingStore } from '@/lib/store';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the store
jest.mock('@/lib/store', () => ({
  useOnboardingStore: jest.fn(),
}));

describe('TimePage', () => {
  const mockPush = jest.fn();
  const mockGoToNextStep = jest.fn();
  const mockGoToPreviousStep = jest.fn();
  const mockSetTimeCommitment = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup store mock
    (useOnboardingStore as jest.Mock).mockReturnValue({
      timeCommitment: null,
      setTimeCommitment: mockSetTimeCommitment,
      error: null,
      currentStep: 4,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });
  });

  it('renders the time commitment page correctly', () => {
    render(<TimePage />);

    // Check if the title and description are rendered
    expect(screen.getByText('How Much Time Can You Commit?')).toBeInTheDocument();
    expect(screen.getByText(/Select your preferred time commitment/)).toBeInTheDocument();

    // Check if all time commitment options are rendered
    expect(screen.getByText('Light (1-2 hours/week)')).toBeInTheDocument();
    expect(screen.getByText('Moderate (3-5 hours/week)')).toBeInTheDocument();
    expect(screen.getByText('Intensive (6+ hours/week)')).toBeInTheDocument();

    // Check if the next button is disabled initially
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('enables the next button when a time commitment is selected', () => {
    // Setup store with a selected time commitment
    (useOnboardingStore as jest.Mock).mockReturnValue({
      timeCommitment: 'casual',
      setTimeCommitment: mockSetTimeCommitment,
      error: null,
      currentStep: 4,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<TimePage />);

    // Check if the next button is enabled
    expect(screen.getByTestId('next-button')).not.toBeDisabled();
  });

  it('calls setTimeCommitment when a time commitment is selected', () => {
    render(<TimePage />);

    // Select a time commitment
    const lightOption = screen.getByText('Light (1-2 hours/week)');
    fireEvent.click(lightOption);

    // Check if setTimeCommitment was called with the correct value
    expect(mockSetTimeCommitment).toHaveBeenCalledWith('light');
  });

  it('redirects to the complete page when next is clicked', () => {
    // Setup store with a selected time commitment
    (useOnboardingStore as jest.Mock).mockReturnValue({
      timeCommitment: 'light',
      setTimeCommitment: mockSetTimeCommitment,
      error: null,
      currentStep: 4,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<TimePage />);

    // Click the next button
    fireEvent.click(screen.getByTestId('next-button'));

    // Check if goToNextStep was called
    expect(mockGoToNextStep).toHaveBeenCalled();

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/onboarding/complete');
  });

  it('redirects to the learning page when back is clicked', () => {
    render(<TimePage />);

    // Click the back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    // Check if goToPreviousStep was called
    expect(mockGoToPreviousStep).toHaveBeenCalled();

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/onboarding/learning');
  });

  it('shows error message when error is present', () => {
    // Setup store with an error
    (useOnboardingStore as jest.Mock).mockReturnValue({
      timeCommitment: null,
      setTimeCommitment: mockSetTimeCommitment,
      error: 'Please select a time commitment',
      currentStep: 4,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<TimePage />);

    // Check if error message is displayed
    expect(screen.getByTestId('error-alert')).toHaveTextContent('Please select a time commitment');
  });

  it('redirects to complete page if time commitment is already selected', async () => {
    // Setup store with a selected time commitment
    (useOnboardingStore as jest.Mock).mockReturnValue({
      timeCommitment: 'light',
      setTimeCommitment: mockSetTimeCommitment,
      error: null,
      currentStep: 4,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<TimePage />);

    // Wait for the redirect to happen
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/complete');
    });
  });
}); 