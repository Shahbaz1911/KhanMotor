
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import InventoryClientPage from './InventoryClientPage';

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <InventoryClientPage />
    </Suspense>
  );
}
