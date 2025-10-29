import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { ScaleInfo } from './ScaleInfo';

interface ScaleQuestionnairesProps {
  scaleType: string;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function ScaleQuestionnaires({ scaleType, onSubmit, isLoading }: ScaleQuestionnairesProps) {
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let score = 0;
    const answerValues = Object.values(answers);

    switch (scaleType) {
      case 'MIDAS':
        score = answerValues.reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
        break;
      case 'HADS':
      case 'BDI':
      case 'PSQI':
      case 'FSS':
      case 'PSS':
        score = answerValues.reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
        break;
      case 'WPI':
        score = answerValues.filter((val: any) => val === 'yes').length;
        break;
      case 'Allodynia':
        score = answerValues.reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
        break;
      default:
        score = 0;
    }

    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateScore();
    onSubmit({
      scaleType,
      score,
      answers: JSON.stringify(answers),
      interpretation: getInterpretation(scaleType, score),
    });
  };

  const getInterpretation = (type: string, score: number): string => {
    switch (type) {
      case 'MIDAS':
        if (score <= 5) return '輕度或無失能';
        if (score <= 10) return '輕度失能';
        if (score <= 20) return '中度失能';
        return '重度失能';
      case 'HADS':
        if (score <= 7) return '正常';
        if (score <= 10) return '邊緣異常';
        return '異常';
      case 'BDI':
        if (score <= 13) return '最小程度憂鬱';
        if (score <= 19) return '輕度憂鬱';
        if (score <= 28) return '中度憂鬱';
        return '重度憂鬱';
      case 'PSQI':
        return score > 5 ? '睡眠品質差' : '睡眠品質良好';
      case 'FSS':
        return score >= 36 ? '有顯著疲勞' : '無顯著疲勞';
      case 'WPI':
        return `疼痛部位數：${score}`;
      case 'Allodynia':
        if (score <= 2) return '無異常性疼痛';
        if (score <= 8) return '輕度異常性疼痛';
        return '中重度異常性疼痛';
      case 'PSS':
        if (score <= 13) return '低壓力';
        if (score <= 26) return '中度壓力';
        return '高壓力';
      default:
        return '';
    }
  };

  // MIDAS 量表
  const MIDASQuestions = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>1. 在過去三個月中，有幾天因為頭痛而無法上班、上學或處理家務？</Label>
        <Input
          type="number"
          min="0"
          placeholder="天數"
          value={answers.q1 || ''}
          onChange={(e) => handleAnswerChange('q1', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>2. 在過去三個月中，有幾天因為頭痛而使工作或活動的效率減少一半以上？</Label>
        <Input
          type="number"
          min="0"
          placeholder="天數"
          value={answers.q2 || ''}
          onChange={(e) => handleAnswerChange('q2', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>3. 在過去三個月中，有幾天因為頭痛而無法做家務？</Label>
        <Input
          type="number"
          min="0"
          placeholder="天數"
          value={answers.q3 || ''}
          onChange={(e) => handleAnswerChange('q3', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>4. 在過去三個月中，有幾天因為頭痛而使做家務的效率減少一半以上？</Label>
        <Input
          type="number"
          min="0"
          placeholder="天數"
          value={answers.q4 || ''}
          onChange={(e) => handleAnswerChange('q4', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>5. 在過去三個月中，有幾天因為頭痛而錯過家庭、社交或休閒活動？</Label>
        <Input
          type="number"
          min="0"
          placeholder="天數"
          value={answers.q5 || ''}
          onChange={(e) => handleAnswerChange('q5', e.target.value)}
          required
        />
      </div>
    </div>
  );

  // HADS 量表
  const HADSQuestions = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">請選擇最符合您過去一週感受的選項</p>
      
      {[
        { id: 'q1', text: '我感到緊張或緊繃', options: ['完全沒有', '偶爾', '經常', '幾乎總是'] },
        { id: 'q2', text: '我仍然喜歡以前喜歡的事情', options: ['完全一樣', '沒那麼多', '只有一點', '幾乎沒有'] },
        { id: 'q3', text: '我有一種害怕的感覺，好像某些可怕的事即將發生', options: ['完全沒有', '有一點', '是的，相當嚴重', '非常嚴重'] },
        { id: 'q4', text: '我能夠笑並看到事情有趣的一面', options: ['完全能夠', '現在沒那麼多', '現在很少', '完全不能'] },
        { id: 'q5', text: '我腦中有令人擔憂的想法', options: ['只是偶爾', '有時候', '很多時候', '非常多時候'] },
        { id: 'q6', text: '我感到愉快', options: ['從來沒有', '不常', '有時候', '大部分時候'] },
        { id: 'q7', text: '我能夠放鬆地坐著並感到輕鬆', options: ['完全能夠', '通常能夠', '不常', '完全不能'] },
        { id: 'q8', text: '我感覺自己好像變慢了', options: ['完全沒有', '有時候', '經常', '幾乎總是'] },
        { id: 'q9', text: '我有一種害怕的感覺（像胃部翻攪）', options: ['完全沒有', '偶爾', '相當經常', '非常經常'] },
        { id: 'q10', text: '我對自己的外表失去興趣', options: ['我一如既往地在意', '可能沒那麼在意', '我不太在意', '完全不在意'] },
        { id: 'q11', text: '我感到坐立不安，必須保持忙碌', options: ['完全沒有', '不太多', '相當多', '非常多'] },
        { id: 'q12', text: '我期待享受事情', options: ['和以前一樣', '沒以前那麼多', '比以前少得多', '幾乎沒有'] },
        { id: 'q13', text: '我突然感到恐慌', options: ['完全沒有', '不太經常', '相當經常', '非常經常'] },
        { id: 'q14', text: '我能夠享受一本好書或廣播或電視節目', options: ['經常', '有時候', '不常', '很少'] },
      ].map((q, index) => (
        <div key={q.id} className="space-y-2">
          <Label>{index + 1}. {q.text}</Label>
          <RadioGroup
            value={answers[q.id]}
            onValueChange={(value) => handleAnswerChange(q.id, value)}
            required
          >
            {q.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );

  // BDI 量表
  const BDIQuestions = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">請選擇最能描述您過去兩週（包括今天）感受的選項</p>
      
      {[
        { 
          id: 'q1', 
          text: '悲傷', 
          options: ['我不感到悲傷', '我感到悲傷', '我一直感到悲傷且無法擺脫', '我非常悲傷或不快樂，以至於無法忍受'] 
        },
        { 
          id: 'q2', 
          text: '悲觀', 
          options: ['我對未來並不悲觀', '我對未來感到悲觀', '我覺得沒有什麼可期待的', '我覺得未來毫無希望，事情不會好轉'] 
        },
        { 
          id: 'q3', 
          text: '過去的失敗', 
          options: ['我不覺得自己是失敗的', '我覺得我比一般人失敗得多', '回顧我的生活，我看到的都是失敗', '我覺得自己是個徹底的失敗者'] 
        },
        { 
          id: 'q4', 
          text: '失去樂趣', 
          options: ['我像以前一樣享受事情', '我不像以前那樣享受事情', '我從任何事情中都得不到真正的滿足', '我對一切都不滿意或感到厭倦'] 
        },
        { 
          id: 'q5', 
          text: '罪惡感', 
          options: ['我沒有特別的罪惡感', '我經常感到罪惡', '我大部分時候感到罪惡', '我一直感到罪惡'] 
        },
        { 
          id: 'q6', 
          text: '懲罰感', 
          options: ['我不覺得我正在受到懲罰', '我覺得我可能會受到懲罰', '我預期會受到懲罰', '我覺得我正在受到懲罰'] 
        },
        { 
          id: 'q7', 
          text: '自我厭惡', 
          options: ['我對自己的感覺和以前一樣', '我對自己失去信心', '我對自己感到失望', '我厭惡自己'] 
        },
        { 
          id: 'q8', 
          text: '自我批評', 
          options: ['我不比以前更多地批評或責備自己', '我比以前更多地批評自己', '我批評自己所有的錯誤', '我責備自己發生的每一件壞事'] 
        },
        { 
          id: 'q9', 
          text: '自殺想法', 
          options: ['我沒有任何自殺的想法', '我有自殺的想法但不會付諸行動', '我想自殺', '如果有機會我會自殺'] 
        },
        { 
          id: 'q10', 
          text: '哭泣', 
          options: ['我哭的次數不比以前多', '我比以前哭得更多', '我現在一直在哭', '我以前能夠哭泣，但現在即使我想哭也哭不出來'] 
        },
      ].map((q, index) => (
        <div key={q.id} className="space-y-2">
          <Label>{index + 1}. {q.text}</Label>
          <RadioGroup
            value={answers[q.id]}
            onValueChange={(value) => handleAnswerChange(q.id, value)}
            required
          >
            {q.options.map((option, i) => (
              <div key={i} className="flex items-start space-x-2">
                <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} className="mt-1" />
                <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );

  // PSQI 量表
  const PSQIQuestions = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">以下問題與您最近一個月的睡眠習慣有關</p>
      
      <div className="space-y-2">
        <Label>1. 在過去一個月，您晚上通常幾點上床？</Label>
        <Input
          type="time"
          value={answers.q1 || ''}
          onChange={(e) => handleAnswerChange('q1', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>2. 在過去一個月，您通常需要多久時間才能入睡？（分鐘）</Label>
        <Input
          type="number"
          min="0"
          placeholder="分鐘"
          value={answers.q2 || ''}
          onChange={(e) => handleAnswerChange('q2', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>3. 在過去一個月，您早上通常幾點起床？</Label>
        <Input
          type="time"
          value={answers.q3 || ''}
          onChange={(e) => handleAnswerChange('q3', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>4. 在過去一個月，您每晚實際睡眠時間為多少小時？</Label>
        <Input
          type="number"
          min="0"
          max="24"
          step="0.5"
          placeholder="小時"
          value={answers.q4 || ''}
          onChange={(e) => handleAnswerChange('q4', e.target.value)}
          required
        />
      </div>

      {[
        { id: 'q5a', text: '無法在30分鐘內入睡', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5b', text: '半夜或清晨醒來', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5c', text: '需要起床上廁所', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5d', text: '呼吸不順暢', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5e', text: '咳嗽或大聲打鼾', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5f', text: '覺得太冷', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5g', text: '覺得太熱', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5h', text: '做惡夢', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
        { id: 'q5i', text: '疼痛', options: ['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'] },
      ].map((q, index) => (
        <div key={q.id} className="space-y-2">
          <Label>5{String.fromCharCode(97 + index)}. 在過去一個月，多常因為{q.text}而睡不好？</Label>
          <RadioGroup
            value={answers[q.id]}
            onValueChange={(value) => handleAnswerChange(q.id, value)}
            required
          >
            {q.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}

      <div className="space-y-2">
        <Label>6. 在過去一個月，您如何評價自己整體的睡眠品質？</Label>
        <RadioGroup
          value={answers.q6}
          onValueChange={(value) => handleAnswerChange('q6', value)}
          required
        >
          {['非常好', '還算好', '還算差', '非常差'].map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={i.toString()} id={`q6-${i}`} />
              <Label htmlFor={`q6-${i}`} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>7. 在過去一個月，多常需要服用藥物（處方或非處方）幫助睡眠？</Label>
        <RadioGroup
          value={answers.q7}
          onValueChange={(value) => handleAnswerChange('q7', value)}
          required
        >
          {['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'].map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={i.toString()} id={`q7-${i}`} />
              <Label htmlFor={`q7-${i}`} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>8. 在過去一個月，多常在開車、吃飯或參加社交活動時無法保持清醒？</Label>
        <RadioGroup
          value={answers.q8}
          onValueChange={(value) => handleAnswerChange('q8', value)}
          required
        >
          {['沒有', '少於一週一次', '一週一或兩次', '一週三次或以上'].map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={i.toString()} id={`q8-${i}`} />
              <Label htmlFor={`q8-${i}`} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>9. 在過去一個月，您覺得保持做事的熱忱有多困難？</Label>
        <RadioGroup
          value={answers.q9}
          onValueChange={(value) => handleAnswerChange('q9', value)}
          required
        >
          {['沒有問題', '只有一點問題', '有些問題', '非常大的問題'].map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={i.toString()} id={`q9-${i}`} />
              <Label htmlFor={`q9-${i}`} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  // FSS 量表
  const FSSQuestions = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">請根據過去一週的情況，選擇最符合您的選項（1=非常不同意，7=非常同意）</p>
      
      {[
        '我的動機會因為疲勞而降低',
        '運動會讓我感到疲勞',
        '我很容易疲勞',
        '疲勞會干擾我的身體功能',
        '疲勞經常造成問題',
        '疲勞會妨礙我持續進行身體活動',
        '疲勞會干擾我執行某些職責和責任',
        '疲勞是我最讓人困擾的三個症狀之一',
        '疲勞會干擾我的工作、家庭或社交生活',
      ].map((text, index) => (
        <div key={`q${index + 1}`} className="space-y-2">
          <Label>{index + 1}. {text}</Label>
          <RadioGroup
            value={answers[`q${index + 1}`]}
            onValueChange={(value) => handleAnswerChange(`q${index + 1}`, value)}
            required
          >
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div key={num} className="flex flex-col items-center space-y-2">
                  <RadioGroupItem value={(num - 1).toString()} id={`q${index + 1}-${num}`} />
                  <Label htmlFor={`q${index + 1}-${num}`} className="font-normal cursor-pointer text-sm">
                    {num}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );

  // WPI 量表
  const WPIQuestions = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">在過去一週，您在以下哪些部位感到疼痛？請勾選所有適用的選項</p>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          '肩膀（左）', '肩膀（右）',
          '上臂（左）', '上臂（右）',
          '下臂（左）', '下臂（右）',
          '臀部（左）', '臀部（右）',
          '大腿（左）', '大腿（右）',
          '小腿（左）', '小腿（右）',
          '下巴（左）', '下巴（右）',
          '胸部', '腹部',
          '上背', '下背',
          '頸部',
        ].map((part, index) => (
          <div key={`q${index + 1}`} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`wpi-${index}`}
              checked={answers[`q${index + 1}`] === 'yes'}
              onChange={(e) => handleAnswerChange(`q${index + 1}`, e.target.checked ? 'yes' : 'no')}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor={`wpi-${index}`} className="font-normal cursor-pointer">
              {part}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  // Allodynia 量表
  const AllodyniaQuestions = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">當您頭痛時，以下活動是否會讓您的頭痛加劇？</p>
      
      {[
        { id: 'q1', text: '梳頭髮', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q2', text: '綁馬尾', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q3', text: '刮鬍子', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q4', text: '戴眼鏡', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q5', text: '戴隱形眼鏡', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q6', text: '戴耳環', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q7', text: '戴項鍊', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q8', text: '頭靠在枕頭上', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q9', text: '接觸冷水', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q10', text: '暴露在熱或冷的環境', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q11', text: '洗澡或淋浴', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
        { id: 'q12', text: '頭髮或臉部被風吹', options: ['不適用', '不會', '很少', '少於一半時間', '大部分時間'] },
      ].map((q, index) => (
        <div key={q.id} className="space-y-2">
          <Label>{index + 1}. {q.text}</Label>
          <RadioGroup
            value={answers[q.id]}
            onValueChange={(value) => handleAnswerChange(q.id, value)}
            required
          >
            {q.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );

  // PSS 量表
  const PSSQuestions = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">在過去一個月，您多常有以下的感受或想法？</p>
      
      {[
        '因為一些意外發生的事情而感到心煩意亂',
        '感覺無法控制生活中重要的事情',
        '感到緊張和壓力',
        '成功處理惱人的生活麻煩',
        '感覺能有效地處理發生的重要改變',
        '對於處理個人問題感到有信心',
        '感覺事情都在自己掌握之中',
        '發現自己無法處理所有必須做的事情',
        '能夠控制生活中的煩惱',
        '感覺一切都在掌控之中',
        '因為事情超出自己的控制而生氣',
        '發現自己一直在想那些必須完成的事情',
        '能夠控制時間的運用',
        '感覺困難不斷堆積而無法克服',
      ].map((text, index) => (
        <div key={`q${index + 1}`} className="space-y-2">
          <Label>{index + 1}. {text}</Label>
          <RadioGroup
            value={answers[`q${index + 1}`]}
            onValueChange={(value) => handleAnswerChange(`q${index + 1}`, value)}
            required
          >
            {['從不', '幾乎從不', '有時', '相當經常', '非常經常'].map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={i.toString()} id={`q${index + 1}-${i}`} />
                <Label htmlFor={`q${index + 1}-${i}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );

  const renderQuestionnaire = () => {
    switch (scaleType) {
      case 'MIDAS':
        return <MIDASQuestions />;
      case 'HADS':
        return <HADSQuestions />;
      case 'BDI':
        return <BDIQuestions />;
      case 'PSQI':
        return <PSQIQuestions />;
      case 'FSS':
        return <FSSQuestions />;
      case 'WPI':
        return <WPIQuestions />;
      case 'Allodynia':
        return <AllodyniaQuestions />;
      case 'PSS':
        return <PSSQuestions />;
      default:
        return <p>未知的量表類型</p>;
    }
  };

  const getScaleFullName = () => {
    const names: { [key: string]: string } = {
      'MIDAS': 'MIDAS 偏頭痛失能評估量表',
      'HADS': 'HADS 醫院焦慮憂鬱量表',
      'BDI': 'BDI 貝克憂鬱量表',
      'PSQI': 'PSQI 匹茲堡睡眠品質量表',
      'FSS': 'FSS 疲勞嚴重程度量表',
      'WPI': 'WPI 廣泛性疼痛指數',
      'Allodynia': 'Allodynia 異常性疼痛問卷',
      'PSS': 'PSS 知覺壓力量表',
    };
    return names[scaleType] || scaleType;
  };

  return (
    <div className="space-y-6">
      <ScaleInfo scaleType={scaleType} />
      
      <Card>
        <CardHeader>
          <CardTitle>{getScaleFullName()}</CardTitle>
          <CardDescription>請仔細閱讀每個問題並誠實作答</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderQuestionnaire()}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '提交量表'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
