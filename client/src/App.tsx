import React from 'react';
import EmotionDetector from './components/EmotionDetector';
import { BeakerIcon, ChartBarIcon } from '@heroicons/react/20/solid';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BeakerIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Emotsioonide Jälgija</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-primary flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Statistika
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Reaalajas Emotsioonide Analüüs</h2>
              <p className="mt-4 text-lg text-gray-600">
                See rakendus analüüsib teie näoilmeid ja tuvastab emotsioone reaalajas,
                kasutades tehisintellekti.
              </p>
            </div>
            <EmotionDetector />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Emotsioonide Jälgija. Kõik õigused kaitstud.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
