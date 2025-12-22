import React from 'react';

// Skeleton animé pour masquer les temps de chargement
export const SkeletonLoader = ({ width = 'w-full', height = 'h-4', count = 1, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} bg-neutral-200 rounded animate-pulse`}
        />
      ))}
    </div>
  );
};

// Skeleton pour KPI card
export const KPISkeletonLoader = () => {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="size-8 rounded-[10px] bg-neutral-200" />
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 rounded w-24 mb-2" />
          <div className="h-6 bg-neutral-200 rounded w-32 mb-2" />
          <div className="h-2 bg-neutral-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
};

// Skeleton pour row tâche
export const TaskSkeletonLoader = () => {
  return (
    <div className="px-4 bg-white h-20 flex items-center gap-3 border-b border-neutral-200 animate-pulse">
      <div className="size-8 bg-neutral-200 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-neutral-200 rounded w-32 mb-2" />
        <div className="h-3 bg-neutral-200 rounded w-48" />
      </div>
      <div className="flex-1 h-2 bg-neutral-200 rounded" />
      <div className="size-10 bg-neutral-200 rounded-lg flex-shrink-0" />
    </div>
  );
};

// Skeleton pour liste de contacts
export const ContactSkeletonLoader = () => {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-neutral-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 rounded w-32 mb-2" />
          <div className="h-3 bg-neutral-200 rounded w-40" />
        </div>
      </div>
    </div>
  );
};

// Wrapper pour les sections avec stale data
export const DataLoader = ({
  loading,
  error,
  children,
  skeletonComponent: SkeletonComponent,
  skeletonCount = 3,
  showStaleData = false
}) => {
  if (error && !showStaleData) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (loading && !showStaleData) {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonComponent key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {children}
      {loading && showStaleData && (
        <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
          <div className="text-xs text-neutral-500 bg-white px-3 py-1 rounded-full">
            Mise à jour...
          </div>
        </div>
      )}
    </>
  );
};
