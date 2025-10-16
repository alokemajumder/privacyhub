import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-slate-300 mb-4">404</div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Page Not Found
          </h1>

          <p className="text-slate-600 mb-6">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
          </p>

          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/#analyzer" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Analyze Policy
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
