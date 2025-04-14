import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import FocusPage from '../page';
import { useOnboardingStore } from '@/lib/store';
import { FOCUS_AREAS } from '@/lib/constants';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the store
jest.mock('@/lib/store', () => ({
  useOnboardingStore: jest.fn(),
}));

describe('FocusPage', () => {
  const mockPush = jest.fn();
  const mockGoToNextStep = jest.fn();
  const mockGoToPreviousStep = jest.fn();
  const mockSetFocusAreas = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup store mock
    (useOnboardingStore as jest.Mock).mockReturnValue({
      focusAreas: [],
      setFocusAreas: mockSetFocusAreas,
      error: null,
      currentStep: 2,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });
  });

  it('renders the focus page correctly', () => {
    render(<FocusPage />);

    // Check if the title and description are rendered
    expect(screen.getByText('Choose Your Focus Areas')).toBeInTheDocument();
    expect(screen.getByText(/Select the areas you want to focus on/)).toBeInTheDocument();

    // Check if all focus areas are rendered
    FOCUS_AREAS.forEach((area) => {
      expect(screen.getByText(area)).toBeInTheDocument();
    });

    // Check if the next button is disabled initially
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('enables the next button when at least one focus area is selected', () => {
    // Setup store with selected focus areas
    (useOnboardingStore as jest.Mock).mockReturnValue({
      focusAreas: ['habits'],
      setFocusAreas: mockSetFocusAreas,
      error: null,
      currentStep: 2,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<FocusPage />);

    // Check if the next button is enabled
    expect(screen.getByTestId('next-button')).not.toBeDisabled();
  });

  it('calls setFocusAreas when a focus area is selected', () => {
    render(<FocusPage />);

    // Select a focus area
    const firstFocusArea = screen.getByText(FOCUS_AREAS[0]);
    fireEvent.click(firstFocusArea);

    // Check if setFocusAreas was called with the correct value
    expect(mockSetFocusAreas).toHaveBeenCalledWith([FOCUS_AREAS[0]]);
  });

  it('redirects to the learning page when next is clicked', () => {
    // Setup store with selected focus areas
    (useOnboardingStore as jest.Mock).mockReturnValue({
      focusAreas: [FOCUS_AREAS[0]],
      setFocusAreas: mockSetFocusAreas,
      error: null,
      currentStep: 2,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<FocusPage />);

    // Click the next button
    fireEvent.click(screen.getByTestId('next-button'));

    // Check if goToNextStep was called
    expect(mockGoToNextStep).toHaveBeenCalled();

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/onboarding/learning');
  });

  it('redirects to the vibe page when back is clicked', () => {
    render(<FocusPage />);

    // Click the back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    // Check if goToPreviousStep was called
    expect(mockGoToPreviousStep).toHaveBeenCalled();

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/onboarding/vibe');
  });

  it('shows error message when error is present', () => {
    // Setup store with an error
    (useOnboardingStore as jest.Mock).mockReturnValue({
      focusAreas: [],
      setFocusAreas: mockSetFocusAreas,
      error: 'Please select at least one focus area',
      currentStep: 2,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<FocusPage />);

    // Check if error message is displayed
    expect(screen.getByTestId('error-alert')).toHaveTextContent('Please select at least one focus area');
  });

  it('redirects to learning page if focus areas are already selected', async () => {
    // Setup store with selected focus areas
    (useOnboardingStore as jest.Mock).mockReturnValue({
      focusAreas: [FOCUS_AREAS[0]],
      setFocusAreas: mockSetFocusAreas,
      error: null,
      currentStep: 2,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<FocusPage />);

    // Wait for the redirect to happen
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/learning');
    });
  });

  it('allows selecting multiple focus areas', () => {
    let focusAreas: string[] = [];
    const mockSetFocusAreas = jest.fn((areas: string[]) => {
      focusAreas = areas;
      (useOnboardingStore as jest.Mock).mockImplementation(() => ({
        focusAreas,
        setFocusAreas: mockSetFocusAreas,
        error: null,
        currentStep: 2,
        goToNextStep: mockGoToNextStep,
        goToPreviousStep: mockGoToPreviousStep,
      }));
    });

    (useOnboardingStore as jest.Mock).mockImplementation(() => ({
      focusAreas,
      setFocusAreas: mockSetFocusAreas,
      error: null,
      currentStep: 2,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    }));

    const { rerender } = render(<FocusPage />);

    // Get all checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Click the first checkbox (habits)
    fireEvent.click(checkboxes[0]);
    rerender(<FocusPage />);
    
    // Click the second checkbox (mindset)
    fireEvent.click(checkboxes[1]);
    rerender(<FocusPage />);
    
    // Verify both areas are selected
    expect(focusAreas).toContain('habits');
    expect(focusAreas).toContain('mindset');
    expect(focusAreas.length).toBe(2);
  });

  it('allows deselecting focus areas', () => {
    // Setup store with selected focus areas
    (useOnboardingStore as jest.Mock).mockReturnValue({
      focusAreas: [FOCUS_AREAS[0]],
      setFocusAreas: mockSetFocusAreas,
      error: null,
      currentStep: 2,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
    });

    render(<FocusPage />);

    // Deselect a focus area
    fireEvent.click(screen.getByText(FOCUS_AREAS[0]));

    // Check if setFocusAreas was called with an empty array
    expect(mockSetFocusAreas).toHaveBeenCalledWith([]);
  });
}); 