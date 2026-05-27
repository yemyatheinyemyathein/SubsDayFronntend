import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useImportSubscriptions } from '@/hooks/useSubscriptions';
import type { Subscription } from '@/types';

interface ImportCSVProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ImportCSV: React.FC<ImportCSVProps> = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Partial<Subscription>[]>([]);
  const [error, setError] = useState('');

  const importMutation = useImportSubscriptions();

  const parseCSV = (text: string): Partial<Subscription>[] => {
    const lines = text.split('\n').filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const subscriptions: Partial<Subscription>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const sub: Record<string, string> = {};
      headers.forEach((header, index) => {
        sub[header] = values[index] || '';
      });

      subscriptions.push({
        name: sub.name || sub.service || sub.subscription || 'Unknown',
        price: parseFloat(sub.price || sub.cost || sub.amount || '0'),
        currency: (sub.currency || sub.curr || 'USD').toUpperCase(),
        billingCycle: (sub.billingcycle || sub.cycle || sub.frequency || 'monthly') as Subscription['billingCycle'],
        nextBillingDate: sub.nextbillingdate || sub.nextbilling || sub.date || new Date().toISOString(),
        category: sub.category || sub.cat || 'Other',
        status: 'active',
      });
    }

    return subscriptions;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setPreview(parsed);
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    try {
      await importMutation.mutateAsync(preview);
      onSuccess();
    } catch {
      setError('Failed to import subscriptions');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Upload a CSV file with columns: name, price, currency, billingCycle, nextBillingDate, category
        </p>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-accent">
          <X size={18} />
        </button>
      </div>

      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
        <div className="flex flex-col items-center justify-center py-4">
          <Upload size={24} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {file ? file.name : 'Click to upload CSV'}
          </p>
        </div>
        <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
      </label>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {preview.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            Preview: {preview.length} subscriptions found
          </p>
          <div className="max-h-48 overflow-y-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Currency</th>
                  <th className="px-3 py-2 text-left">Cycle</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 5).map((sub, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{sub.name}</td>
                    <td className="px-3 py-2">{sub.price}</td>
                    <td className="px-3 py-2">{sub.currency}</td>
                    <td className="px-3 py-2">{sub.billingCycle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 5 && (
              <p className="text-xs text-muted-foreground px-3 py-2">
                ...and {preview.length - 5} more
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn-primary"
          disabled={preview.length === 0 || importMutation.isPending}
          onClick={handleImport}
        >
          {importMutation.isPending ? 'Importing...' : `Import ${preview.length} subscriptions`}
        </button>
      </div>
    </div>
  );
};

export default ImportCSV;
