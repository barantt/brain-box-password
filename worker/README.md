# Cloudflare Worker 部署指南

## 前置条件

1. 安装 Node.js (>=16.0.0)
2. 安装 Wrangler CLI: `npm install -g wrangler`
3. Cloudflare 账户

## 部署步骤

### 1. 登录 Cloudflare
```bash
wrangler login
```

### 2. 创建 KV 命名空间
```bash
# 创建开发环境 KV
wrangler kv namespace create "BRAIN_BOX_SCORES" --env dev

# 创建生产环境 KV
wrangler kv namespace create "BRAIN_BOX_SCORES" --env production
```

### 3. 更新 wrangler.toml
将上面命令返回的 KV namespace ID 更新到 `wrangler.toml` 文件中：

```toml
[[kv_namespaces]]
binding = "BRAIN_BOX_SCORES"
id = "your-actual-kv-namespace-id" # 替换为实际的 ID

[env.dev]
kv_namespaces = [
  { binding = "BRAIN_BOX_SCORES", id = "your-dev-kv-namespace-id" }
]

[env.production]
kv_namespaces = [
  { binding = "BRAIN_BOX_SCORES", id = "your-production-kv-namespace-id" }
]
```

### 4. 安装依赖
```bash
cd worker
npm install
```

### 5. 本地开发测试
```bash
npm run dev
```

### 6. 部署到 Cloudflare Workers

#### 开发环境部署
```bash
npm run deploy:dev
```

#### 生产环境部署
```bash
npm run deploy:prod
```

## API 端点

部署完成后，API 端点将是：
- 开发环境: `https://brain-box-password-api.your-worker-subdomain.workers.dev/api`
- 生产环境: `https://brain-box-password-api.your-worker-subdomain.workers.dev/api`

### 支持的 API

1. **获取分数列表**
   ```
   GET /api/scores
   GET /api/scores?limit=10
   ```

2. **保存分数**
   ```
   POST /api/scores
   Content-Type: application/json

   {
     "name": "Player Name",
     "time": 123456,
     "date": "2024-01-01T12:00:00.000Z"
   }
   ```

3. **获取排名**
   ```
   GET /api/scores/rank?time=123456
   ```

4. **健康检查**
   ```
   GET /health
   ```

## 自定义域名（可选）

1. 在 Cloudflare 控制面板中添加自定义域名
2. 在 `wrangler.toml` 中配置：

```toml
[env.production.routes]
pattern = "api.your-domain.com/*"
zone_name = "your-domain.com"
```

3. 重新部署：
```bash
npm run deploy:prod
```

## 数据存储

- 使用 Cloudflare Workers KV 存储分数数据
- 数据格式为 JSON，包含：name, time, date, timestamp, id
- 自动按时间排序，最快的排在前面

## 注意事项

1. KV 存储有读取和写入限制，请合理使用
2. 免费版 Worker 有每日请求限制
3. 数据持久性由 Cloudflare KV 保证
4. 跨域请求已配置，支持前端访问

## 更新前端配置

部署完成后，请更新项目根目录的 `config.js` 文件中的 `API_BASE_URL` 为你的 Worker 地址。