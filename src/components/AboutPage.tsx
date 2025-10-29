import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { HeartPulse, Users, TrendingUp, ClipboardList, Mail, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <HeartPulse className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-primary mb-4">偏頭痛個案照護系統</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            專業的頭痛管理與追蹤平台，為病人、醫師與個案管理師提供完整的照護解決方案
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>系統介紹</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                偏頭痛個案照護系統是一個專為偏頭痛患者設計的全方位照護平台。系統整合了病患自我管理、醫師診療輔助、以及個案管理師追蹤功能，提供完整的照護循環。
              </p>
              <p>
                透過系統化的記錄與分析，病患可以更好地了解自己的頭痛模式，醫師可以獲得更精確的診療資訊，個案管理師則能有效追蹤高風險病患，提升整體照護品質。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>主要功能</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3>病人功能</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 記錄每日頭痛狀況</li>
                    <li>• 追蹤症狀與用藥</li>
                    <li>• 填寫健康量表</li>
                    <li>• 查看個人趨勢圖表</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3>醫師功能</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 查看病患列表</li>
                    <li>• 分析頭痛趨勢</li>
                    <li>• 檢視用藥統計</li>
                    <li>• 追蹤量表評估</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <h3>個管師功能</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 識別高風險病患</li>
                    <li>• 記錄追蹤狀況</li>
                    <li>• 安排回診提醒</li>
                    <li>• 管理照護計畫</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>健康量表說明</CardTitle>
              <CardDescription>系統提供多種標準化量表以全面評估病患狀況</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="mb-1">MIDAS（偏頭痛失能評估量表）</h4>
                <p className="text-sm text-muted-foreground">
                  評估頭痛對日常生活、工作和社交活動的影響程度，協助醫師了解疾病嚴重度。評分範圍：0-21+ 分，分數越高表示失能程度越嚴重。
                </p>
              </div>
              <div>
                <h4 className="mb-1">HADS（醫院焦慮憂鬱量表）</h4>
                <p className="text-sm text-muted-foreground">
                  篩檢焦慮與憂鬱症狀，包含 14 題問題。評分範圍：0-21 分，7 分以下為正常，8-10 分為邊緣異常，11 分以上為異常。
                </p>
              </div>
              <div>
                <h4 className="mb-1">BDI（貝克憂鬱量表）</h4>
                <p className="text-sm text-muted-foreground">
                  評估憂鬱症狀的嚴重程度，包含 21 個項目。評分範圍：0-63 分，0-13 分為最小程度，14-19 分為輕度，20-28 分為中度，29-63 分為重度憂鬱。
                </p>
              </div>
              <div>
                <h4 className="mb-1">PSQI（匹茲堡睡眠品質量表）</h4>
                <p className="text-sm text-muted-foreground">
                  評估睡眠品質，睡眠問題可能是偏頭痛的誘發因子。評分範圍：0-21 分，總分大於 5 分表示睡眠品質差。
                </p>
              </div>
              <div>
                <h4 className="mb-1">FSS（疲勞嚴重程度量表）</h4>
                <p className="text-sm text-muted-foreground">
                  評估疲勞對日常生活的影響程度，共 9 題。評分範圍：9-63 分，總分 36 分以上表示有顯著疲勞。
                </p>
              </div>
              <div>
                <h4 className="mb-1">WPI（廣泛性疼痛指數）</h4>
                <p className="text-sm text-muted-foreground">
                  評估疼痛部位的分布範圍，用於纖維肌痛症的診斷。評分範圍：0-19，計算過去一週疼痛部位的數量。
                </p>
              </div>
              <div>
                <h4 className="mb-1">Allodynia（異常性疼痛問卷）</h4>
                <p className="text-sm text-muted-foreground">
                  評估偏頭痛時的異常性疼痛症狀，即正常不會引起疼痛的刺激卻引發疼痛。評分 0-2 分為無，3-8 分為輕度，9 分以上為中重度異常性疼痛。
                </p>
              </div>
              <div>
                <h4 className="mb-1">PSS（知覺壓力量表）</h4>
                <p className="text-sm text-muted-foreground">
                  評估個人在過去一個月的壓力感受程度，共 14 題。評分範圍：0-56 分，0-13 分為低壓力，14-26 分為中度壓力，27 分以上為高壓力。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Mail className="w-5 h-5 inline mr-2" />
                聯絡我們
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm mb-2">如有任何問題或建議，歡迎與我們聯繫：</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span>support@headache-care.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">電話:</span>
                    <span>0800-123-456</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">服務時間:</span>
                    <span>週一至週五 9:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>重要提醒：</strong>此系統僅供原型展示與研究用途，請勿輸入真實的個人醫療資料。
                如有實際醫療需求，請諮詢專業醫療人員。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
