import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

export default function ScanHistory() {
  const { userId } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) return <div className="p-6 text-center">Loading history...</div>;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Scan History</h2>
      
      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No previous scans found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((scan) => (
            <div key={scan._id} className="border border-gray-100 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{scan.url}</p>
                <p className="text-sm text-gray-500">
                  {new Date(scan.createdAt).toLocaleDateString()} at {new Date(scan.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scan.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {scan.status.toUpperCase()}
                </span>
                <div className="text-right">
                  <p className="font-bold">{scan.reportData?.Issues?.length || 0}</p>
                  <p className="text-xs text-gray-500">Issues</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}