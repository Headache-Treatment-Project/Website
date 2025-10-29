import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import * as bcrypt from 'npm:bcrypt';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// 註冊
app.post('/make-server-87716d9e/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    // 檢查用戶是否已存在
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ error: '此 Email 已被註冊' }, 400);
    }

    // 使用 Supabase Auth 創建用戶
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true // 自動確認 email，因為未配置郵件伺服器
    });

    if (authError) {
      console.log(`註冊時的授權錯誤: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // 儲存用戶資料到 KV store
    const user = {
      id: authData.user.id,
      email,
      name,
      role, // 'patient', 'doctor', 'case_manager'
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${email}`, user);
    await kv.set(`user:id:${authData.user.id}`, user);

    return c.json({ success: true, user });
  } catch (error) {
    console.log(`註冊過程發生錯誤: ${error}`);
    return c.json({ error: '註冊失敗' }, 500);
  }
});

// 登入
app.post('/make-server-87716d9e/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log(`登入時的授權錯誤: ${error.message}`);
      return c.json({ error: '登入失敗，請檢查 Email 與密碼' }, 401);
    }

    const user = await kv.get(`user:${email}`);

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user
    });
  } catch (error) {
    console.log(`登入過程發生錯誤: ${error}`);
    return c.json({ error: '登入失敗' }, 500);
  }
});

// 獲取當前用戶資料
app.get('/make-server-87716d9e/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.log(`獲取用戶時的授權錯誤: ${error?.message}`);
      return c.json({ error: '未授權' }, 401);
    }

    const userData = await kv.get(`user:id:${user.id}`);
    return c.json({ user: userData });
  } catch (error) {
    console.log(`獲取用戶資料時發生錯誤: ${error}`);
    return c.json({ error: '獲取用戶資料失敗' }, 500);
  }
});

// 新增頭痛記錄
app.post('/make-server-87716d9e/headache-log', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: '未授權' }, 401);
    }

    const logData = await c.req.json();
    const logId = `headache_log:${user.id}:${Date.now()}`;
    
    const log = {
      id: logId,
      patientId: user.id,
      ...logData,
      createdAt: new Date().toISOString()
    };

    await kv.set(logId, log);
    
    return c.json({ success: true, log });
  } catch (error) {
    console.log(`新增頭痛記錄時發生錯誤: ${error}`);
    return c.json({ error: '新增記錄失敗' }, 500);
  }
});

// 獲取頭痛記錄
app.get('/make-server-87716d9e/headache-logs/:patientId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: '未授權' }, 401);
    }

    const patientId = c.req.param('patientId');
    const logs = await kv.getByPrefix(`headache_log:${patientId}:`);
    
    return c.json({ logs: logs || [] });
  } catch (error) {
    console.log(`獲取頭痛記錄時發生錯誤: ${error}`);
    return c.json({ error: '獲取記錄失敗' }, 500);
  }
});

// 新增健康量表
app.post('/make-server-87716d9e/health-scale', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: '未授權' }, 401);
    }

    const scaleData = await c.req.json();
    const scaleId = `health_scale:${user.id}:${scaleData.scaleType}:${Date.now()}`;
    
    const scale = {
      id: scaleId,
      patientId: user.id,
      ...scaleData,
      createdAt: new Date().toISOString()
    };

    await kv.set(scaleId, scale);
    
    return c.json({ success: true, scale });
  } catch (error) {
    console.log(`新增健康量表時發生錯誤: ${error}`);
    return c.json({ error: '新增量表失敗' }, 500);
  }
});

// 獲取健康量表
app.get('/make-server-87716d9e/health-scales/:patientId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: '未授權' }, 401);
    }

    const patientId = c.req.param('patientId');
    const scales = await kv.getByPrefix(`health_scale:${patientId}:`);
    
    return c.json({ scales: scales || [] });
  } catch (error) {
    console.log(`獲取健康量表時發生錯誤: ${error}`);
    return c.json({ error: '獲取量表失敗' }, 500);
  }
});

// 獲取所有病患（醫師和個管師使用）
app.get('/make-server-87716d9e/patients', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: '未授權' }, 401);
    }

    const currentUser = await kv.get(`user:id:${user.id}`);
    if (!currentUser || (currentUser.role !== 'doctor' && currentUser.role !== 'case_manager')) {
      return c.json({ error: '無權限訪問' }, 403);
    }

    // 獲取所有用戶並篩選出病患
    const allUsers = await kv.getByPrefix('user:id:');
    const patients = allUsers.filter((u: any) => u.role === 'patient');
    
    return c.json({ patients });
  } catch (error) {
    console.log(`獲取病患列表時發生錯誤: ${error}`);
    return c.json({ error: '獲取病患列表失敗' }, 500);
  }
});

// 新增/更新追蹤記錄
app.post('/make-server-87716d9e/follow-up', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: '未授權' }, 401);
    }

    const currentUser = await kv.get(`user:id:${user.id}`);
    if (!currentUser || currentUser.role !== 'case_manager') {
      return c.json({ error: '無權限操作' }, 403);
    }

    const followUpData = await c.req.json();
    const followUpId = `follow_up:${followUpData.patientId}`;
    
    const followUp = {
      id: followUpId,
      patientId: followUpData.patientId,
      caseManagerId: user.id,
      ...followUpData,
      updatedAt: new Date().toISOString()
    };

    await kv.set(followUpId, followUp);
    
    return c.json({ success: true, followUp });
  } catch (error) {
    console.log(`新增追蹤記錄時發生錯誤: ${error}`);
    return c.json({ error: '操作失敗' }, 500);
  }
});

// 獲取追蹤記錄
app.get('/make-server-87716d9e/follow-ups', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: '未提供授權令牌' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: '未授權' }, 401);
    }

    const followUps = await kv.getByPrefix('follow_up:');
    
    return c.json({ followUps: followUps || [] });
  } catch (error) {
    console.log(`獲取追蹤記錄時發生錯誤: ${error}`);
    return c.json({ error: '獲取記錄失敗' }, 500);
  }
});

Deno.serve(app.fetch);
