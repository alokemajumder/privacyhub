import React from 'react';
import { PrivacyAnalysis } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface AlphabeticalBrowserProps {
  analyses: PrivacyAnalysis[];
  onSelect: (analysis: PrivacyAnalysis) => void;
}

export default function AlphabeticalBrowser({ analyses: _analyses, onSelect: _onSelect }: AlphabeticalBrowserProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground text-center">
          Browse feature will be available after component migration is complete.
        </p>
      </CardContent>
    </Card>
  );
}