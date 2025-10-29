import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, TrendingUp, LogOut, Calendar } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DoctorDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function DoctorDashboard({ user, accessToken, onLogout }: DoctorDashboardProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientLogs, setPatientLogs] = useState<any[]>([]);
  const [patientScales, setPatientScales] = useState<any[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/patients`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPatients(data.patients || []);
      }
    } catch (err) {
      console.error('載入病患列表錯誤:', err);
    }
  };

  const loadPatientData = async (patientId: string) => {
    try {
      // 載入頭痛記錄
      const logsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/headache-logs/${patientId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const logsData = await logsResponse.json();
      if (logsResponse.ok) {
        setPatientLogs(logsData.logs || []);
      }

      // 載入健康量表
      const scalesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/health-scales/${patientId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const scalesData = await scalesResponse.json();
      if (scalesResponse.ok) {
        setPatientScales(scalesData.scales || []);
      }
    } catch (err) {
      console.error('載入病患資料錯誤:', err);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    loadPatientData(patient.id);
  };

  // 準備圖表資料
  const chartData = patientLogs
    .slice(-30)
    .map(log => ({
      date: new Date(log.date).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }),
      強度: log.intensity,
    }));

  const medicationData = patientLogs.reduce((acc: any, log) => {
    if (log.medication) {
      const existing = acc.find((item: any) => item.medication === log.medication);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ medication: log.medication, count: 1 });
      }
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-primary">醫師後台</h1>
              <p className="text-sm text-muted-foreground">歡迎，{user.name} 醫師</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>
                <Users className="w-5 h-5 inline mr-2" />
                病患列表
              </CardTitle>
              <CardDescription>共 {patients.length} 位病患</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'bg-primary text-white'
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    <div>{patient.name}</div>
                    <div className="text-sm opacity-80">{patient.email}</div>
                  </button>
                ))}
                {patients.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">尚無病患資料</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>病患資訊：{selectedPatient.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">總記錄數</p>
                        <p className="text-primary">{patientLogs.length} 筆</p>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">平均疼痛強度</p>
                        <p className="text-primary">
                          {patientLogs.length > 0
                            ? (patientLogs.reduce((sum, log) => sum + log.intensity, 0) / patientLogs.length).toFixed(1)
                            : '0'}{' '}
                          / 10
                        </p>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">已完成量表</p>
                        <p className="text-primary">{patientScales.length} 份</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>頭痛強度趨勢（近 30 天）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="強度" stroke="#4a90e2" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">尚無資料</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>用藥統計</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {medicationData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={medicationData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="medication" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#4a90e2" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">尚無資料</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>健康量表記錄</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patientScales.map((scale, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                          <div>
                            <div>{scale.scaleType}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(scale.createdAt).toLocaleDateString('zh-TW')}
                            </div>
                          </div>
                          <div className="text-primary">總分：{scale.score}</div>
                        </div>
                      ))}
                      {patientScales.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">尚無量表資料</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>近期頭痛記錄</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patientLogs.slice(0, 10).map((log, index) => (
                        <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>{log.date} {log.time}</span>
                            </div>
                            <span className="text-primary">強度 {log.intensity}/10</span>
                          </div>
                          <p className="text-sm text-muted-foreground">症狀：{log.symptoms}</p>
                          {log.medication && (
                            <p className="text-sm text-muted-foreground">用藥：{log.medication}</p>
                          )}
                          {log.notes && (
                            <p className="text-sm text-muted-foreground">備註：{log.notes}</p>
                          )}
                        </div>
                      ))}
                      {patientLogs.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">尚無記錄</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-16">
                  <p className="text-muted-foreground text-center">請從左側選擇病患以查看詳細資料</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
