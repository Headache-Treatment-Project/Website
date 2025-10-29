import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ClipboardList, LogOut, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface CaseManagerDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function CaseManagerDashboard({ user, accessToken, onLogout }: CaseManagerDashboardProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [patientsData, setPatientsData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 載入病患列表
      const patientsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/patients`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const patientsData = await patientsResponse.json();
      if (patientsResponse.ok) {
        setPatients(patientsData.patients || []);
        
        // 為每個病患載入資料
        const dataMap: any = {};
        for (const patient of patientsData.patients || []) {
          const logsResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/headache-logs/${patient.id}`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );
          const logsData = await logsResponse.json();
          dataMap[patient.id] = {
            logs: logsData.logs || [],
          };
        }
        setPatientsData(dataMap);
      }

      // 載入追蹤記錄
      const followUpsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/follow-ups`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const followUpsData = await followUpsResponse.json();
      if (followUpsResponse.ok) {
        setFollowUps(followUpsData.followUps || []);
      }
    } catch (err) {
      console.error('載入資料錯誤:', err);
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const followUpData = {
      patientId: selectedPatient.id,
      riskLevel: formData.get('riskLevel'),
      notes: formData.get('notes'),
      nextAppointment: formData.get('nextAppointment'),
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/follow-up`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(followUpData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || '新增追蹤記錄失敗');
        setIsLoading(false);
        return;
      }

      // 重新載入資料
      await loadData();
      setIsDialogOpen(false);
      setSelectedPatient(null);
      setIsLoading(false);
    } catch (err) {
      console.error('新增追蹤記錄錯誤:', err);
      setError('新增追蹤記錄失敗');
      setIsLoading(false);
    }
  };

  const getRiskLevel = (patientId: string) => {
    const data = patientsData[patientId];
    if (!data || !data.logs || data.logs.length === 0) return 'low';
    
    const recentLogs = data.logs.slice(-7);
    const avgIntensity = recentLogs.reduce((sum: number, log: any) => sum + log.intensity, 0) / recentLogs.length;
    const frequency = recentLogs.length;

    if (avgIntensity >= 7 || frequency >= 5) return 'high';
    if (avgIntensity >= 5 || frequency >= 3) return 'medium';
    return 'low';
  };

  const getRiskBadgeVariant = (level: string) => {
    if (level === 'high') return 'destructive';
    if (level === 'medium') return 'default';
    return 'secondary';
  };

  const getRiskLabel = (level: string) => {
    if (level === 'high') return '高風險';
    if (level === 'medium') return '中風險';
    return '低風險';
  };

  const highRiskPatients = patients.filter(p => getRiskLevel(p.id) === 'high');
  const mediumRiskPatients = patients.filter(p => getRiskLevel(p.id) === 'medium');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-primary">個案管理師追蹤系統</h1>
              <p className="text-sm text-muted-foreground">歡迎，{user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>高風險病患</CardDescription>
              <CardTitle className="text-destructive">{highRiskPatients.length} 位</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>中風險病患</CardDescription>
              <CardTitle className="text-primary">{mediumRiskPatients.length} 位</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>追蹤記錄總數</CardDescription>
              <CardTitle className="text-primary">{followUps.length} 筆</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <AlertCircle className="w-5 h-5 inline mr-2 text-destructive" />
              高風險病患
            </CardTitle>
            <CardDescription>需要優先關注的病患</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskPatients.map((patient) => {
                const data = patientsData[patient.id];
                const followUp = followUps.find(f => f.patientId === patient.id);
                const recentLogs = data?.logs?.slice(-7) || [];
                const avgIntensity = recentLogs.length > 0
                  ? (recentLogs.reduce((sum: number, log: any) => sum + log.intensity, 0) / recentLogs.length).toFixed(1)
                  : '0';

                return (
                  <div key={patient.id} className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{patient.name}</span>
                          <Badge variant="destructive">高風險</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                      </div>
                      <Dialog open={isDialogOpen && selectedPatient?.id === patient.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setSelectedPatient(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedPatient(patient)}>
                            新增追蹤
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>新增追蹤記錄：{patient.name}</DialogTitle>
                            <DialogDescription>記錄病患追蹤狀況與下次回診時間</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddFollowUp} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="riskLevel">風險等級</Label>
                              <select
                                id="riskLevel"
                                name="riskLevel"
                                className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                              >
                                <option value="high">高風險</option>
                                <option value="medium">中風險</option>
                                <option value="low">低風險</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nextAppointment">下次回診日期</Label>
                              <Input
                                id="nextAppointment"
                                name="nextAppointment"
                                type="date"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes">追蹤備註</Label>
                              <Textarea
                                id="notes"
                                name="notes"
                                placeholder="記錄追蹤內容、聯繫情況等..."
                                rows={4}
                                required
                              />
                            </div>
                            {error && <div className="text-destructive text-sm">{error}</div>}
                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsDialogOpen(false);
                                  setSelectedPatient(null);
                                }}
                              >
                                取消
                              </Button>
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    儲存中...
                                  </>
                                ) : (
                                  '儲存'
                                )}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">近 7 天記錄：</span>
                        <span className="ml-1">{recentLogs.length} 次</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">平均強度：</span>
                        <span className="ml-1">{avgIntensity}/10</span>
                      </div>
                    </div>
                    {followUp && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">下次回診：</span>
                          <span>{followUp.nextAppointment}</span>
                        </div>
                        {followUp.notes && (
                          <p className="text-sm text-muted-foreground mt-1">備註：{followUp.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {highRiskPatients.length === 0 && (
                <p className="text-muted-foreground text-center py-8">目前沒有高風險病患</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>所有病患追蹤狀態</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => {
                const riskLevel = getRiskLevel(patient.id);
                const data = patientsData[patient.id];
                const followUp = followUps.find(f => f.patientId === patient.id);
                const recentLogs = data?.logs?.slice(-7) || [];

                return (
                  <div key={patient.id} className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{patient.name}</span>
                          <Badge variant={getRiskBadgeVariant(riskLevel)}>
                            {getRiskLabel(riskLevel)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                      </div>
                      <Dialog open={isDialogOpen && selectedPatient?.id === patient.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setSelectedPatient(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedPatient(patient)}>
                            {followUp ? '更新追蹤' : '新增追蹤'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>追蹤記錄：{patient.name}</DialogTitle>
                            <DialogDescription>記錄病患追蹤狀況與下次回診時間</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddFollowUp} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="riskLevel">風險等級</Label>
                              <select
                                id="riskLevel"
                                name="riskLevel"
                                defaultValue={followUp?.riskLevel || riskLevel}
                                className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                              >
                                <option value="high">高風險</option>
                                <option value="medium">中風險</option>
                                <option value="low">低風險</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nextAppointment">下次回診日期</Label>
                              <Input
                                id="nextAppointment"
                                name="nextAppointment"
                                type="date"
                                defaultValue={followUp?.nextAppointment}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes">追蹤備註</Label>
                              <Textarea
                                id="notes"
                                name="notes"
                                placeholder="記錄追蹤內容、聯繫情況等..."
                                rows={4}
                                defaultValue={followUp?.notes}
                                required
                              />
                            </div>
                            {error && <div className="text-destructive text-sm">{error}</div>}
                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsDialogOpen(false);
                                  setSelectedPatient(null);
                                }}
                              >
                                取消
                              </Button>
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    儲存中...
                                  </>
                                ) : (
                                  '儲存'
                                )}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      近 7 天記錄：{recentLogs.length} 次
                    </div>
                    {followUp && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">下次回診：</span>
                          <span>{followUp.nextAppointment}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {patients.length === 0 && (
                <p className="text-muted-foreground text-center py-8">尚無病患資料</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
