"use client";
import { useTranslation } from '@/hooks/useTranslation';

const LanguageLoader = () => {
  const { isLoading } = useTranslation();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div className="h-full bg-[#C08237] animate-pulse"></div>
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C08237]"></div>
          <span>Translating website...</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageLoader;