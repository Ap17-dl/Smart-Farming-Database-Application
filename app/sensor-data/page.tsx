'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SensorDataPage() {
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSensorData();
  }, [currentPage]);

  const fetchSensorData = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/sensor-data', window.location.origin);
      url.searchParams.set('page', currentPage.toString());

      const res = await fetch(url);
      const data = await res.json();
      setSensorData(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch sensor data - ensure database is connected');
      setSensorData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  const getSensorTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Temperature': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      'Humidity': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'Soil Moisture': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'pH': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Sensor Data</h1>
          </div>
          <p className="text-muted-foreground">Real-time sensor readings from your farms</p>
        </div>

        <Card className="bg-white dark:bg-card border-accent/20">
          <CardHeader>
            <CardTitle>Latest Sensor Readings</CardTitle>
            <CardDescription>Historical sensor data from all IoT sensors</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-accent/20">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Sensor Type</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  ) : sensorData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">
                        No sensor data available
                      </td>
                    </tr>
                  ) : (
                    sensorData.map((data, idx) => (
                      <tr key={idx} className="border-b border-accent/10 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm">{formatDate(data.Timestamp)}</td>
                        <td className="py-3 px-4">{data.Location}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSensorTypeColor(data.SensorType)}`}>
                            {data.SensorType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold">{data.Value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="text-xs"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-xs"
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="text-xs"
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20 mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-primary">About Sensor Data</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground space-y-2">
            <p>
              ✓ <strong>Real-time Monitoring:</strong> Get live updates from IoT sensors installed across your farms
            </p>
            <p>
              ✓ <strong>Multiple Sensor Types:</strong> Temperature, Humidity, Soil Moisture, and pH levels
            </p>
            <p>
              ✓ <strong>Location Tracking:</strong> Identify which farm location each sensor is monitoring
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
