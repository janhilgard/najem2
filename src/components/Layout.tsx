import React from 'react';
import { Menu, Home, Users, Building2, Receipt, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Správa pronájmů</h1>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600">
                <Home className="h-5 w-5" />
                <span>Přehled</span>
              </Link>
            </li>
            <li>
              <Link to="/najemnici" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600">
                <Users className="h-5 w-5" />
                <span>Nájemníci</span>
              </Link>
            </li>
            <li>
              <Link to="/jednotky" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600">
                <Building2 className="h-5 w-5" />
                <span>Jednotky</span>
              </Link>
            </li>
            <li>
              <Link to="/predpisy" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600">
                <Receipt className="h-5 w-5" />
                <span>Předpisy</span>
              </Link>
            </li>
            <li>
              <Link to="/platby" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600">
                <CreditCard className="h-5 w-5" />
                <span>Platby</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Odhlásit se</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}