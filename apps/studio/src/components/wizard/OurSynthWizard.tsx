import React, { useState } from 'react';
import Step1NameAndDescription from './Step1NameAndDescription';
import Step2CoreFeatures from './Step2CoreFeatures';
import Step3AISuggestions from './Step3AISuggestions';

const OurSynthWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);

  const handleNextStep1 = (data: { name: string; description: string }) => {
    setName(data.name);
    setDescription(data.description);
    setStep(2);
  };

  const handleNextStep2 = (features: string[]) => {
    setFeatures(features);
    setStep(3);
  };

  const handleFinish = () => {
    // Finalize wizard, e.g., save data or redirect
    setStep(1);
    setName('');
    setDescription('');
    setFeatures([]);
    alert('Wizard complete!');
  };

  return (
    <div>
      {step === 1 && (
        <Step1NameAndDescription onNext={handleNextStep1} initialName={name} initialDescription={description} />
      )}
      {step === 2 && (
        <Step2CoreFeatures onNext={handleNextStep2} initialFeatures={features} />
      )}
      {step === 3 && (
        <Step3AISuggestions appName={name} description={description} features={features} onFinish={handleFinish} />
      )}
    </div>
  );
};

export default OurSynthWizard;
