const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet());

// Gzip 压缩
app.use(compression());

// 日志中间件
app.use(morgan('combined'));

// 请求限流配置
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 在 15 分钟内最多 100 个请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 应用限流中间件
app.use('/api/', limiter);

// 缓存配置（TTL: 1 小时）
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// 请求体大小限制
app.use(express.json({ limit: '10mb' }));

// CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-llm-settings']
}));

app.get('/', (req, res) => {
  res.json({ message: 'RedNote Assistant Backend API', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.post('/api/copywriter/generate', async (req, res) => {
  try {
    const { topic, type, style, keywords } = req.body;

    const llmSettings = req.headers['x-llm-settings'] ? JSON.parse(req.headers['x-llm-settings']) : null;
    
    if (!llmSettings || !llmSettings.apiKey) {
      return res.status(400).json({ 
        success: false, 
        message: 'LLM API key is required. Please configure it in settings.' 
      });
    }

    if (!llmSettings.apiUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'LLM API URL is required. Please configure it in settings.' 
      });
    }

    if (!llmSettings.model) {
      return res.status(400).json({ 
        success: false, 
        message: 'LLM model is required. Please configure it in settings.' 
      });
    }

    // 检查缓存
    const cacheKey = `copywriter_${topic}_${type}_${style}_${keywords}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached result for:', cacheKey);
      return res.json({ success: true, data: cachedResult, cached: true });
    }

    const prompt = `你是一个专业的小红书文案生成助手。请根据以下要求生成小红书文案：

主题：${topic || '产品'}
类型：${type || '生活分享'}
风格：${style || '简洁明了'}
关键词：${keywords || '无'}

请按照以下格式返回JSON：
{
  "titles": ["标题1", "标题2", "标题3", "标题4", "标题5"],
  "content": "正文内容",
  "emojis": ["emoji1", "emoji2", "emoji3"],
  "hashtags": ["标签1", "标签2", "标签3"],
  "analysis": {
    "level": "A",
    "score": 85,
    "advantages": ["优点1", "优点2", "优点3"],
    "disadvantages": ["缺点1", "缺点2"],
    "suggestions": ["建议1", "建议2", "建议3"]
  }
}

要求：
1. 生成5个吸引人的标题，每个标题15-25字，包含1-2个相关emoji
2. 正文内容要符合小红书风格，使用emoji和分段，字数300-500字
3. 推荐3-5个相关emoji
4. 推荐5-10个相关标签
5. 分析文案的爆款潜力，给出等级（A/B/C/D/S）、分数（0-100）、优点、缺点和建议
6. 所有内容必须使用中文

请直接返回JSON格式，不要包含其他说明文字。`;

    let response;
    
    try {
      const requestBody = {
        model: llmSettings.model || 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4096
      };
      
      console.log('Sending request to LLM API:', JSON.stringify(requestBody, null, 2));
      
      // 添加超时和取消机制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 秒超时
      
      response = await axios.post(
        llmSettings.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${llmSettings.apiKey}`
          },
          signal: controller.signal,
          timeout: 60000
        }
      );
      
      clearTimeout(timeoutId);
      
      let content;
      console.log('LLM API response status:', response.status);
      console.log('LLM API response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.choices && response.data.choices[0]) {
        content = response.data.choices[0].message.content;
      } else if (response.data.content && response.data.content[0]) {
        content = response.data.content[0].text;
      } else {
        console.error('Unexpected response format from LLM API');
        console.error('Response data keys:', Object.keys(response.data));
        throw new Error('Unexpected response format from LLM API');
      }
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse LLM response');
      }
      
      const result = JSON.parse(jsonMatch[0]);
      
      // 保存到缓存
      cache.set(cacheKey, result);
      
      res.json({ success: true, data: result, cached: false });
    } catch (error) {
      console.error('Error calling LLM API:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        return res.status(408).json({
          success: false,
          message: '请求超时，请稍后重试'
        });
      }
      
      // 处理速率限制错误
      if (error.response?.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'API 请求频率超限，请稍后重试'
        });
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error generating copywriter:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate copywriter' 
    });
  }
});

app.post('/api/topic-selector/generate', async (req, res) => {
  try {
    const { domain } = req.body;
    
    console.log('Topic selector request body:', req.body);

    const llmSettings = req.headers['x-llm-settings'] ? JSON.parse(req.headers['x-llm-settings']) : null;
    
    console.log('LLM Settings:', llmSettings);
    
    if (!llmSettings || !llmSettings.apiKey) {
      return res.status(400).json({ 
        success: false, 
        message: 'LLM API key is required. Please configure it in settings.' 
      });
    }

    if (!llmSettings.apiUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'LLM API URL is required. Please configure it in settings.' 
      });
    }

    if (!llmSettings.model) {
      return res.status(400).json({ 
        success: false, 
        message: 'LLM model is required. Please configure it in settings.' 
      });
    }

    // 检查缓存
    const cacheKey = `topic_${domain}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached result for:', cacheKey);
      return res.json({ success: true, data: cachedResult, cached: true });
    }

    const prompt = `你是一个专业的小红书选题推荐助手。请根据以下要求生成选题推荐：

领域：${domain || 'beauty'}

请按照以下格式返回JSON：
{
  "topics": [
    {
      "name": "选题名称",
      "type": "选题类型",
      "level": "A",
      "description": "选题描述",
      "evaluation": {
        "userDemand": 85,
        "competition": 70,
        "innovation": 80,
        "selfMatch": 85,
        "total": 80
      }
    }
  ],
  "total": 10,
  "domain": "${domain || 'beauty'}",
  "trendAnalysis": {
    "currentTrends": ["趋势1", "趋势2", "趋势3"],
    "crossPlatformTrends": ["跨平台趋势1", "跨平台趋势2"],
    "seasonalFactors": ["季节因素1", "季节因素2"],
    "userNeeds": ["用户需求1", "用户需求2"]
  }
}

要求：
1. 生成10个相关选题
2. 每个选题包含名称、类型、等级、描述和评估
3. 评估包含用户需求、竞争、创新、自我匹配和总分（0-100）
4. 等级根据总分确定：S(90-100)、A(80-89)、B(70-79)、C(60-69)、D(0-59)
5. 趋势分析包含当前趋势、跨平台趋势、季节因素和用户需求
6. 所有内容必须使用中文

请直接返回JSON格式，不要包含其他说明文字。`;

    let response;
    
    try {
      const requestBody = {
        model: llmSettings.model || 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4096
      };
      
      console.log('Sending request to LLM API:', JSON.stringify(requestBody, null, 2));
      
      // 添加超时和取消机制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 秒超时
      
      response = await axios.post(
        llmSettings.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${llmSettings.apiKey}`
          },
          signal: controller.signal,
          timeout: 60000
        }
      );
      
      clearTimeout(timeoutId);
      
      let content;
      console.log('LLM API response status:', response.status);
      console.log('LLM API response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.choices && response.data.choices[0]) {
        content = response.data.choices[0].message.content;
      } else if (response.data.content && response.data.content[0]) {
        content = response.data.content[0].text;
      } else {
        console.error('Unexpected response format from LLM API');
        console.error('Response data keys:', Object.keys(response.data));
        throw new Error('Unexpected response format from LLM API');
      }
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse LLM response');
      }
      
      const result = JSON.parse(jsonMatch[0]);
      
      // 保存到缓存
      cache.set(cacheKey, result);
      
      res.json({ success: true, data: result, cached: false });
    } catch (error) {
      console.error('Error calling LLM API:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        return res.status(408).json({
          success: false,
          message: '请求超时，请稍后重试'
        });
      }
      
      // 处理速率限制错误
      if (error.response?.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'API 请求频率超限，请稍后重试'
        });
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error generating topic selector:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate topic selector' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/copywriter/generate`);
  console.log(`  POST /api/topic-selector/generate`);
});
