import React from 'react';
import { Building2, Users, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from './StatCard';
import { usePrehledStore } from '../../stores/prehledStore';

export default function StatisticsGrid() {
  const { getStats } = usePrehledStore();
  const stats = getStats();

  return (
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
  );
}