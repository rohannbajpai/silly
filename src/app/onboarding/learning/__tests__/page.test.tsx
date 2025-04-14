import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LearningPage from '../page';
import { useOnboardingStore } from '@/lib/store';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the store
jest.mock('@/lib/store', () => ({
  useOnboardingStore: jest.fn(),
}));

describe('LearningPage', () => {
  const mockPush = jest.fn();
  const mockGoToNextStep = jest.fn();
  const mockGoToPreviousStep = jest.fn();
  const mockSetLearningStyle = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup store mock
    (useOnboardingStore as jest.Mock).mockReturnValue({
      learningStyle: null,
      setLearningStyle: mockSetLearningStyle,
      error: null,
      currentStep: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });
  });

  it('renders the learning style page correctly', () => {
    render(<LearningPage />);

    // Check if the title and description are rendered
    expect(screen.getByText('How Do You Learn Best?')).toBeInTheDocument();
    expect(screen.getByText(/Select your preferred learning style/)).toBeInTheDocument();

    // Check if all learning style options are rendered
    expect(screen.getByText('Visual Learner')).toBeInTheDocument();
    expect(screen.getByText('Auditory Learner')).toBeInTheDocument();
    expect(screen.getByText('Reading/Writing Learner')).toBeInTheDocument();
    expect(screen.getByText('Kinesthetic Learner')).toBeInTheDocument();

    // Check if the next button is disabled initially
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('enables the next button when a learning style is selected', () => {
    // Setup store with a selected learning style
    (useOnboardingStore as jest.Mock).mockReturnValue({
      learningStyle: 'visual',
      setLearningStyle: mockSetLearningStyle,
      error: null,
      currentStep: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<LearningPage />);

    // Check if the next button is enabled
    expect(screen.getByTestId('next-button')).not.toBeDisabled();
  });

  it('calls setLearningStyle when a learning style is selected', () => {
    render(<LearningPage />);

    // Select a learning style
    const visualOption = screen.getByText('Visual Learner');
    fireEvent.click(visualOption);

    // Check if setLearningStyle was called with the correct value
    expect(mockSetLearningStyle).toHaveBeenCalledWith('visual');
  });

  it('redirects to the time page when next is clicked', () => {
    // Setup store with a selected learning style
    (useOnboardingStore as jest.Mock).mockReturnValue({
      learningStyle: 'visual',
      setLearningStyle: mockSetLearningStyle,
      error: null,
      currentStep: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<LearningPage />);

    // Click the next button
    fireEvent.click(screen.getByTestId('next-button'));

    // Check if goToNextStep was called
    expect(mockGoToNextStep).toHaveBeenCalled();

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/onboarding/time');
  });

  it('redirects to the focus page when back is clicked', () => {
    render(<LearningPage />);

    // Click the back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    // Check if goToPreviousStep was called
    expect(mockGoToPreviousStep).toHaveBeenCalled();

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/onboarding/focus');
  });

  it('shows error message when error is present', () => {
    // Setup store with an error
    (useOnboardingStore as jest.Mock).mockReturnValue({
      learningStyle: null,
      setLearningStyle: mockSetLearningStyle,
      error: 'Please select a learning style',
      currentStep: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<LearningPage />);

    // Check if error message is displayed
    expect(screen.getByTestId('error-alert')).toHaveTextContent('Please select a learning style');
  });

  it('redirects to time page if learning style is already selected', async () => {
    // Setup store with a selected learning style
    (useOnboardingStore as jest.Mock).mockReturnValue({
      learningStyle: 'visual',
      setLearningStyle: mockSetLearningStyle,
      error: null,
      currentStep: 3,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<LearningPage />);

    // Wait for the redirect to happen
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/time');
    });
  });
}); 