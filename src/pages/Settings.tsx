import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { CURRENCIES } from '@/types';
import { Sun, Moon, Download, Save } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Settings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const [currency, setCurrency] = useState(user?.baseCurrency || 'USD');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = () => {
    const data = localStorage.getItem('subsday-data');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subsday-export.json';
      a.click();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Account</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input mt-1" value={user?.name || ''} disabled />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input mt-1" value={user?.email || ''} disabled />
          </div>
          <div>
            <label className="label">Base Currency</label>
            <select
              className="input mt-1"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button className="btn-primary gap-2" onClick={handleSave}>
            <Save size={16} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Appearance</h3>
        <div className="flex gap-4">
          <button
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              theme === 'light'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground'
            }`}
            onClick={() => setTheme('light')}
          >
            <Sun size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Light</p>
          </button>
          <button
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              theme === 'dark'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground'
            }`}
            onClick={() => setTheme('dark')}
          >
            <Moon size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Dark</p>
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Data</h3>
        <div className="space-y-3">
          <button className="btn-secondary w-full justify-start gap-2" onClick={exportData}>
            <Download size={16} />
            Export Data (JSON)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
