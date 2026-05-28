import { useState } from 'react';
import './App.css';
import StepNavigator from './components/StepNavigator';
import Step1HouseData from './components/Step1HouseData';
import Step2PredictionLine from './components/Step2PredictionLine';
import Step3PredictionErrors from './components/Step3PredictionErrors';

const steps = [
  { title: 'We have data', Component: Step1HouseData },
  { title: 'We need a model', Component: Step2PredictionLine },
  { title: 'The model is wrong', Component: Step3PredictionErrors },
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const { title, Component } = steps[currentStep - 1];

  return (
    <div className="app">
      <StepNavigator
        currentStep={currentStep}
        totalSteps={steps.length}
        title={title}
        onBack={() => setCurrentStep((s) => Math.max(1, s - 1))}
        onNext={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
      />
      <main>
        <Component />
      </main>
    </div>
  );
}

export default App;
