import React, { useState } from 'react';
import Layout from './components/Layout';
import AktivityList from './components/AktivityList';
import NajemniciSaldoPrehled from './components/NajemniciSaldoPrehled';
import { Building2, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { initialNajemnici, initialPlatby, initialPredpisy } from './data/initialData';
import type { Aktivita, Platba } from './types';
import Notification from './components/Notification';
import { useNotification } from './hooks/useNotification';

function StatCard({ title, value, subtext, icon, color }: {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'indigo' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        <p className="mt-1 text-sm text-gray-500">{subtext}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [platby, setPlatby] = useState<Platba[]>(initialPlatby);
  const { notification, showNotification, hideNotification } = useNotification();

  // Sample data - in real app this would come from API/database
  const stats = {
    celkemJednotek: 12,
    obsazeneJednotky: 10,
    celkemNajemniku: 15,
    mesicniPrijem: 156000,
    neuhrazenePlatby: 23000
  };

  // Sample activities data
  const aktivity: Aktivita[] = [
    {
      id: '1',
      typ: 'platba',
      datum: new Date().toISOString(),
      najemnik: {
        id: '1',
        jmeno: 'Jan',
        prijmeni: 'Novák'
      },
      jednotka: {
        id: '1',
        nazev: 'Byt 2+1, ul. Květná 123'
      },
      castka: 12500,
      popis: 'Přijatá platba nájemného za březen 2024'
    },
    {
      id: '2',
      typ: 'predpis',
      datum: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      najemnik: {
        id: '2',
        jmeno: 'Marie',
        prijmeni: 'Svobodová'
      },
      jednotka: {
        id: '2',
        nazev: 'Byt 1+kk, ul. Zahradní 45'
      },
      popis: 'Vytvořen nový předpis plateb'
    },
    {
      id: '3',
      typ: 'najemnik',
      datum: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      najemnik: {
        id: '3',
        jmeno: 'Petr',
        prijmeni: 'Dvořák'
      },
      jednotka: {
        id: '3',
        nazev: 'Byt 3+1, ul. Polní 789'
      },
      popis: 'Nový nájemník přidán do systému'
    }
  ];

  const handlePlatbaAdded = (data: Omit<Platba, 'id'>) => {
    const newPlatba: Platba = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    setPlatby([...platby, newPlatba]);
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
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard
            title="Celkem jednotek"
            value={stats.celkemJednotek}
            subtext={`${stats.obsazeneJednotky} obsazených`}
            icon={<Building2 />}
            color="blue"
          />
          <StatCard
            title="Nájemníci"
            value={stats.celkemNajemniku}
            subtext="aktivních"
            icon={<Users />}
            color="green"
          />
          <StatCard
            title="Měsíční příjem"
            value={`${stats.mesicniPrijem.toLocaleString()} Kč`}
            subtext="za tento měsíc"
            icon={<TrendingUp />}
            color="indigo"
          />
          <StatCard
            title="Neuhrazené platby"
            value={`${stats.neuhrazenePlatby.toLocaleString()} Kč`}
            subtext="po splatnosti"
            icon={<AlertCircle />}
            color="red"
          />
        </div>

        {/* Tenants Balance Overview */}
        <div className="mt-8">
          <NajemniciSaldoPrehled
            najemnici={initialNajemnici}
            platby={platby}
            predpisy={initialPredpisy}
          />
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