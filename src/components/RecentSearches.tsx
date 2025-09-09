import React from 'react';
import { PrivacyAnalysis } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface RecentSearchesProps {
  analyses: PrivacyAnalysis[];
  onSelect: (analysis: PrivacyAnalysis) => void;
}

export default function RecentSearches({ analyses, onSelect }: RecentSearchesProps) {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-foreground mb-6">Recent Searches</h3>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Recent searches will appear here after analysis functionality is complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}