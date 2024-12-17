import React from 'react';
import Layout from './components/Layout';
import AktivityList from './components/AktivityList';
import NajemniciSaldoPrehled from './components/NajemniciSaldoPrehled';
import Notification from './components/Notification';
import { useNotificationStore } from './stores/notificationStore';
import { usePrehledStore } from './stores/prehledStore';
import { usePlatbyStore } from './stores/platbyStore';
import StatisticsGrid from './components/prehled/StatisticsGrid';

export default function App() {
  const { message: notification, hideNotification, showNotification } = useNotificationStore();
  const { aktivity } = usePrehledStore();
  const { addPlatba } = usePlatbyStore();

  const handlePlatbaAdded = (data: Omit<Platba, 'id'>) => {
    addPlatba(data);
    showNotification('Platba byla úspěšně přidána');
  };

  return (
    <Layout>
      {notification && (
        <Notification
          message={notification}
          onClose={hideNotification}
        />
      )}
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Přehled pronájmů</h1>
        
        <StatisticsGrid />

        {/* Tenants Balance Overview */}
        <div className="mt-8">
          <NajemniciSaldoPrehled />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <AktivityList 
              aktivity={aktivity} 
              onPlatbaAdded={handlePlatbaAdded}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}