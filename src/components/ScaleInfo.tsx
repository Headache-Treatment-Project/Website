import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info } from 'lucide-react';

interface ScaleInfoProps {
  scaleType: string;
}

export function ScaleInfo({ scaleType }: ScaleInfoProps) {
  const getScaleInfo = () => {
    switch (scaleType) {
      case 'MIDAS':
        return {
          name: 'MIDAS 偏頭痛失能評估量表',
          description: '評估頭痛對日常生活、工作和社交活動的影響程度',
          items: '5 題',
          scoring: '總分 = 所有天數相加',
          interpretation: [
            '0-5 分：輕度或無失能',
            '6-10 分：輕度失能',
            '11-20 分：中度失能',
            '21 分以上：重度失能',
          ],
        };
      case 'HADS':
        return {
          name: 'HADS 醫院焦慮憂鬱量表',
          description: '篩檢焦慮與憂鬱症狀',
          items: '14 題',
          scoring: '每題 0-3 分，總分 0-21 分',
          interpretation: [
            '0-7 分：正常',
            '8-10 分：邊緣異常',
            '11-21 分：異常',
          ],
        };
      case 'BDI':
        return {
          name: 'BDI 貝克憂鬱量表',
          description: '評估憂鬱症狀的嚴重程度',
          items: '10 題（簡版）',
          scoring: '每題 0-3 分，總分 0-30 分',
          interpretation: [
            '0-13 分：最小程度憂鬱',
            '14-19 分：輕度憂鬱',
            '20-28 分：中度憂鬱',
            '29 分以上：重度憂鬱',
          ],
        };
      case 'PSQI':
        return {
          name: 'PSQI 匹茲堡睡眠品質量表',
          description: '評估睡眠品質',
          items: '19 題（9 個組成部分）',
          scoring: '總分 0-21 分',
          interpretation: [
            '0-5 分：睡眠品質良好',
            '6 分以上：睡眠品質差',
          ],
        };
      case 'FSS':
        return {
          name: 'FSS 疲勞嚴重程度量表',
          description: '評估疲勞對日常生活的影響',
          items: '9 題',
          scoring: '每題 1-7 分，總分 9-63 分',
          interpretation: [
            '9-35 分：無顯著疲勞',
            '36-63 分：有顯著疲勞',
          ],
        };
      case 'WPI':
        return {
          name: 'WPI 廣泛性疼痛指數',
          description: '評估疼痛部位的分布範圍',
          items: '19 個身體部位',
          scoring: '計算疼痛部位數量，0-19 分',
          interpretation: [
            '分數 = 疼痛部位數量',
            '配合症狀嚴重度量表（SSS）用於纖維肌痛症診斷',
          ],
        };
      case 'Allodynia':
        return {
          name: 'Allodynia 異常性疼痛問卷',
          description: '評估偏頭痛時的異常性疼痛症狀',
          items: '12 題',
          scoring: '每題 0-2 分，總分 0-24 分',
          interpretation: [
            '0-2 分：無異常性疼痛',
            '3-8 分：輕度異常性疼痛',
            '9 分以上：中重度異常性疼痛',
          ],
        };
      case 'PSS':
        return {
          name: 'PSS 知覺壓力量表',
          description: '評估個人壓力感受程度',
          items: '14 題',
          scoring: '每題 0-4 分，總分 0-56 分',
          interpretation: [
            '0-13 分：低壓力',
            '14-26 分：中度壓力',
            '27-56 分：高壓力',
          ],
        };
      default:
        return null;
    }
  };

  const info = getScaleInfo();

  if (!info) return null;

  return (
    <Card className="bg-blue-50/50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Info className="w-5 h-5" />
          量表說明
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="mb-1">{info.name}</h4>
          <p className="text-sm text-muted-foreground">{info.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">題數：</span>
            <span>{info.items}</span>
          </div>
          <div>
            <span className="text-muted-foreground">計分：</span>
            <span>{info.scoring}</span>
          </div>
        </div>
        <div>
          <p className="text-sm mb-2">結果判讀：</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {info.interpretation.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
