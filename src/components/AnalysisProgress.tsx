import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AnalysisProgressProps {
  stage: string | null;
}

export default function AnalysisProgress({ stage }: AnalysisProgressProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Analyzing Privacy Policy
        </h3>
        {stage && (
          <p className="text-sm text-muted-foreground">{stage}</p>
        )}
      </div>
      <Progress value={undefined} className="w-full" />
    </div>
  );
}