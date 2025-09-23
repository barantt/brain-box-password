// Cloudflare Worker for Brain Box Password Game Scores API
// 使用 Cloudflare Workers KV 存储分数数据

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 设置 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    // 路由处理
    if (path === '/api/scores' && request.method === 'GET') {
      return await getScores(request, env, corsHeaders);
    } else if (path === '/api/scores' && request.method === 'POST') {
      return await saveScore(request, env, corsHeaders);
    } else if (path === '/api/scores/rank' && request.method === 'GET') {
      return await getRank(request, env, corsHeaders);
    } else if (path === '/health') {
      return await healthCheck(env, corsHeaders);
    } else {
      return new Response(JSON.stringify({
        error: 'Not found',
        message: `The requested path ${path} was not found on this server`
      }), {
        status: 404,
        headers: corsHeaders
      });
    }
  }
};

// 获取分数列表
async function getScores(request, env, headers) {
  try {
    const limit = parseInt(new URL(request.url).searchParams.get('limit')) || 50;

    // 从 KV 获取所有分数
    const scoresList = await env.BRAIN_BOX_SCORES.get('scores', { type: 'json' }) || [];

    // 按 time 排序（从小到大）
    const sortedScores = scoresList.sort((a, b) => a.time - b.time);

    // 限制返回数量
    const limitedScores = sortedScores.slice(0, limit);

    return new Response(JSON.stringify({
      scores: limitedScores,
      total: limitedScores.length
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error getting scores:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get scores'
    }), {
      status: 500,
      headers
    });
  }
}

// 保存分数
async function saveScore(request, env, headers) {
  try {
    const body = await request.json();
    const { name, time, date } = body;

    // 验证数据
    if (!name || typeof time !== 'number' || !date) {
      return new Response(JSON.stringify({
        error: 'Invalid data. Name, time (number), and date are required.'
      }), {
        status: 400,
        headers
      });
    }

    // 创建分数对象
    const completionDate = new Date(date);
    const score = {
      name,
      time,
      date: completionDate.toISOString(),
      timestamp: completionDate.getTime(),
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // 唯一ID
    };

    // 获取现有分数
    const scoresList = await env.BRAIN_BOX_SCORES.get('scores', { type: 'json' }) || [];

    // 添加新分数
    scoresList.push(score);

    // 保存回 KV
    await env.BRAIN_BOX_SCORES.put('scores', JSON.stringify(scoresList));

    return new Response(JSON.stringify({
      message: 'Score saved successfully',
      score
    }), {
      status: 201,
      headers
    });
  } catch (error) {
    console.error('Error saving score:', error);
    return new Response(JSON.stringify({
      error: 'Failed to save score'
    }), {
      status: 500,
      headers
    });
  }
}

// 获取排名
async function getRank(request, env, headers) {
  try {
    const url = new URL(request.url);
    const time = parseInt(url.searchParams.get('time'));

    if (isNaN(time)) {
      return new Response(JSON.stringify({
        error: 'Invalid time parameter'
      }), {
        status: 400,
        headers
      });
    }

    // 获取所有分数
    const scoresList = await env.BRAIN_BOX_SCORES.get('scores', { type: 'json' }) || [];

    // 计算比当前时间更小的分数数量
    const betterScores = scoresList.filter(score => score.time < time);
    const rank = betterScores.length + 1;

    return new Response(JSON.stringify({
      rank,
      time
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error getting rank:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get rank'
    }), {
      status: 500,
      headers
    });
  }
}

// 健康检查
async function healthCheck(env, headers) {
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'brain-box-password-api'
  }), {
    status: 200,
    headers
  });
}