import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function GlobalSearchHistory() {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-foreground mb-6">Community Analyses</h3>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Community analysis history will appear here once the database is fully integrated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}