function StepNavigator({ currentStep, totalSteps, title, onBack, onNext }) {
  return (
    <nav className="step-nav">
      <button onClick={onBack} disabled={currentStep === 1}>
        ← Back
      </button>
      <div className="step-indicator">
        Step {currentStep} of {totalSteps}
        <span className="step-title">{title}</span>
      </div>
      <button onClick={onNext} disabled={currentStep === totalSteps}>
        Next →
      </button>
    </nav>
  );
}

export default StepNavigator;
