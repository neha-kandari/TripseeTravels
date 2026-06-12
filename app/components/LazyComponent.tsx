'use client';

import { ComponentType, Suspense, lazy } from 'react';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

const LazyComponent = ({ component, fallback, ...props }: LazyComponentProps) => {
  const LazyLoadedComponent = lazy(component);

  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  );
};

export default LazyComponent;
