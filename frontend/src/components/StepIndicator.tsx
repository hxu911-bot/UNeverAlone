import React from 'react';

interface StepIndicatorProps {
  currentStep: number; // 1, 2, or 3
  steps?: string[];
}

const defaultSteps = ['背景信息', '邮件配置', '生成结果'];

export function StepIndicator({ currentStep, steps = defaultSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-12">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const isNext = stepNum > currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-sky-500 text-white ring-2 ring-sky-200'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>

              {/* Step label */}
              <div
                className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-sky-600'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {label}
              </div>
            </div>

            {/* Connector line */}
            {stepNum < steps.length && (
              <div
                className={`h-1 flex-1 mx-2 mt-(-8) transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
                style={{ marginTop: '-32px' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
