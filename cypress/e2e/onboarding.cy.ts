describe('Onboarding Flow', () => {
  beforeEach(() => {
    cy.visit('/onboarding');
  });

  it('should complete the onboarding flow successfully', () => {
    // Step 1: Vibe Selection
    cy.get('h1').should('contain', 'Choose Your Vibe');
    cy.get('[data-testid="vibe-card"]').first().click();
    cy.get('button').contains('Next Step').click();

    // Step 2: Focus Areas
    cy.get('h1').should('contain', 'Choose Your Focus Areas');
    cy.get('[data-testid="focus-card"]').first().click();
    cy.get('button').contains('Next Step').click();

    // Step 3: Learning Style
    cy.get('h1').should('contain', 'How Do You Learn Best?');
    cy.get('[data-testid="learning-card"]').first().click();
    cy.get('button').contains('Next Step').click();

    // Step 4: Time Commitment
    cy.get('h1').should('contain', 'How Much Time Can You Commit?');
    cy.get('[data-testid="time-card"]').first().click();
    cy.get('button').contains('Complete Onboarding').click();

    // Completion Page
    cy.get('h1').should('contain', "You're All Set!");
    cy.get('button').contains('Start Your Journey').click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
  });

  it('should handle going back through the flow', () => {
    // Step 1: Vibe Selection
    cy.get('[data-testid="vibe-card"]').first().click();
    cy.get('button').contains('Next Step').click();

    // Step 2: Focus Areas
    cy.get('[data-testid="focus-card"]').first().click();
    cy.get('button').contains('Back').click();

    // Should go back to vibe selection
    cy.get('h1').should('contain', 'Choose Your Vibe');
    cy.get('[data-testid="vibe-card"]').first().should('have.class', 'border-primary');
  });

  it('should show error when trying to proceed without selection', () => {
    // Try to proceed without selecting a vibe
    cy.get('button').contains('Next Step').click();
    cy.get('[data-testid="error-alert"]').should('be.visible');
  });

  it('should maintain selections when going back and forth', () => {
    // Step 1: Select vibe
    cy.get('[data-testid="vibe-card"]').first().click();
    cy.get('button').contains('Next Step').click();

    // Step 2: Select focus area
    cy.get('[data-testid="focus-card"]').first().click();
    cy.get('button').contains('Back').click();

    // Step 1: Vibe should still be selected
    cy.get('[data-testid="vibe-card"]').first().should('have.class', 'border-primary');
    cy.get('button').contains('Next Step').click();

    // Step 2: Focus area should still be selected
    cy.get('[data-testid="focus-card"]').first().should('have.class', 'border-primary');
  });
}); 