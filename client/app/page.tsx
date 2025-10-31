"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';
const Index = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/products');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-2xl space-y-8 text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-elegant">
            <Package className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Product & Order Management
          </h1>
          <p className="max-w-lg mx-auto text-xl text-muted-foreground">
            Streamline your inventory and order processing with our comprehensive dashboard
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={() => router.push('/auth')}
            className="gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
