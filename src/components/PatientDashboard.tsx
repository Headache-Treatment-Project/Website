import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Clock, Activity, FileText, LogOut, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ScaleQuestionnaires } from './ScaleQuestionnaires';

interface PatientDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function PatientDashboard({ user, accessToken, onLogout }: PatientDashboardProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [scales, setScales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedScale, setSelectedScale] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 載入頭痛記錄
      const logsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/headache-logs/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const logsData = await logsResponse.json();
      if (logsResponse.ok) {
        setLogs(logsData.logs || []);
      }

      // 載入健康量表
      const scalesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/health-scales/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const scalesData = await scalesResponse.json();
      if (scalesResponse.ok) {
        setScales(scalesData.scales || []);
      }
    } catch (err) {
      console.error('載入資料錯誤:', err);
    }
  };

  const handleAddLog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const logData = {
      date: formData.get('date'),
      time: formData.get('time'),
      intensity: parseInt(formData.get('intensity') as string),
      symptoms: formData.get('symptoms'),
      medication: formData.get('medication'),
      notes: formData.get('notes'),
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/headache-log`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(logData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || '新增記錄失敗');
        setIsLoading(false);
        return;
      }

      // 重新載入資料
      await loadData();
      e.currentTarget.reset();
      setIsLoading(false);
    } catch (err) {
      console.error('新增記錄錯誤:', err);
      setError('新增記錄失敗');
      setIsLoading(false);
    }
  };

  const handleAddScale = async (scaleData: any) => {
    setIsLoading(true);
    setError('');

    const dataToSubmit = {
      ...scaleData,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-87716d9e/health-scale`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || '新增量表失敗');
        setIsLoading(false);
        return;
      }

      // 重新載入資料
      await loadData();
      setSelectedScale('');
      setIsLoading(false);
    } catch (err) {
      console.error('新增量表錯誤:', err);
      setError('新增量表失敗');
      setIsLoading(false);
    }
  };

  // 準備圖表資料
  const chartData = logs
    .slice(-14)
    .map(log => ({
      date: new Date(log.date).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }),
      強度: log.intensity,
    }));

  const symptomsData = logs.reduce((acc: any, log) => {
    const symptoms = log.symptoms?.split(',').map((s: string) => s.trim()) || [];
    symptoms.forEach((symptom: string) => {
      const existing = acc.find((item: any) => item.symptom === symptom);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ symptom, count: 1 });
      }
    });
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-primary">偏頭痛照護系統</h1>
              <p className="text-sm text-muted-foreground">歡迎，{user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">
              <Activity className="w-4 h-4 mr-2" />
              儀表板
            </TabsTrigger>
            <TabsTrigger value="add-log">
              <Calendar className="w-4 h-4 mr-2" />
              記錄頭痛
            </TabsTrigger>
            <TabsTrigger value="scales">
              <FileText className="w-4 h-4 mr-2" />
              健康量表
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>本月頭痛次數</CardDescription>
                  <CardTitle className="text-primary">{logs.filter(log => {
                    const logDate = new Date(log.date);
                    const now = new Date();
                    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                  }).length} 次</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>平均疼痛強度</CardDescription>
                  <CardTitle className="text-primary">
                    {logs.length > 0 ? (logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length).toFixed(1) : '0'} / 10
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>已完成量表</CardDescription>
                  <CardTitle className="text-primary">{scales.length} 份</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>頭痛強度趨勢（近 14 天）</CardTitle>
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
                <CardTitle>常見症狀統計</CardTitle>
              </CardHeader>
              <CardContent>
                {symptomsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={symptomsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="symptom" />
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
                <CardTitle>最近記錄</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.slice(0, 5).map((log, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{log.date}</span>
                          <Clock className="w-4 h-4 text-primary ml-2" />
                          <span>{log.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">症狀：{log.symptoms}</p>
                        {log.medication && <p className="text-sm text-muted-foreground">用藥：{log.medication}</p>}
                        {log.notes && <p className="text-sm text-muted-foreground">備註：{log.notes}</p>}
                      </div>
                      <div className="text-primary">強度 {log.intensity}/10</div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">尚無記錄</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-log">
            <Card>
              <CardHeader>
                <CardTitle>新增頭痛記錄</CardTitle>
                <CardDescription>記錄您的頭痛症狀與用藥情況</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddLog} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">日期</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">時間</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        defaultValue={new Date().toTimeString().slice(0, 5)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intensity">疼痛強度 (0-10)</Label>
                    <Input
                      id="intensity"
                      name="intensity"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">症狀（用逗號分隔）</Label>
                    <Input
                      id="symptoms"
                      name="symptoms"
                      type="text"
                      placeholder="例如：單側頭痛, 噁心, 畏光"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medication">用藥</Label>
                    <Input
                      id="medication"
                      name="medication"
                      type="text"
                      placeholder="例如：普拿疼 500mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">備註</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="其他想記錄的內容..."
                      rows={3}
                    />
                  </div>
                  {error && <div className="text-destructive text-sm">{error}</div>}
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        新增中...
                      </>
                    ) : (
                      '新增記錄'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scales">
            {!selectedScale ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>選擇健康量表</CardTitle>
                    <CardDescription>選擇您要填寫的量表類型</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {[
                        { value: 'MIDAS', label: 'MIDAS 偏頭痛失能評估量表', desc: '評估頭痛對日常生活的影響' },
                        { value: 'HADS', label: 'HADS 醫院焦慮憂鬱量表', desc: '篩檢焦慮與憂鬱症狀' },
                        { value: 'BDI', label: 'BDI 貝克憂鬱量表', desc: '評估憂鬱症狀的嚴重程度' },
                        { value: 'PSQI', label: 'PSQI 匹茲堡睡眠品質量表', desc: '評估睡眠品質' },
                        { value: 'FSS', label: 'FSS 疲勞嚴重程度量表', desc: '評估疲勞對生活的影響' },
                        { value: 'WPI', label: 'WPI 廣泛性疼痛指數', desc: '評估疼痛部位的分布' },
                        { value: 'Allodynia', label: 'Allodynia 異常性疼痛問卷', desc: '評估異常性疼痛症狀' },
                        { value: 'PSS', label: 'PSS 知覺壓力量表', desc: '評估壓力感受程度' },
                      ].map((scale) => (
                        <button
                          key={scale.value}
                          onClick={() => setSelectedScale(scale.value)}
                          className="text-left p-4 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <div className="mb-1">{scale.label}</div>
                          <div className="text-sm text-muted-foreground">{scale.desc}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>已完成量表</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scales.map((scale, index) => (
                        <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span>{scale.scaleType}</span>
                            <span className="text-primary">總分：{scale.score}</span>
                          </div>
                          {scale.interpretation && (
                            <p className="text-sm text-muted-foreground mb-1">
                              結果：{scale.interpretation}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {new Date(scale.createdAt).toLocaleDateString('zh-TW')}
                          </p>
                        </div>
                      ))}
                      {scales.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">尚未完成任何量表</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedScale('')}
                  className="mb-4"
                >
                  ← 返回選擇量表
                </Button>
                {error && <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-lg">{error}</div>}
                <ScaleQuestionnaires
                  scaleType={selectedScale}
                  onSubmit={handleAddScale}
                  isLoading={isLoading}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
