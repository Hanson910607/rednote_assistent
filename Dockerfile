# 多阶段构建 Dockerfile

# 阶段 1: 构建前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 安装依赖
RUN apk add --no-cache python3 make g++

# 复制前端 package.json 和 package-lock.json
COPY frontend/package*.json ./

# 安装前端依赖
RUN npm install --legacy-peer-deps

# 复制前端源代码
COPY frontend/ ./

# 构建前端
RUN npm run build

# 阶段 2: 生产环境
FROM nginx:alpine AS production

# 安装 Node.js 用于运行后端
RUN apk add --no-cache nodejs npm

# 设置工作目录
WORKDIR /app

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制前端构建产物
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# 复制后端代码
COPY server.js package.json ./

# 安装后端依赖
RUN npm install --only=production

# 暴露端口
EXPOSE 80

# 启动 nginx 和后端
CMD sh -c "node server.js & nginx -g 'daemon off;'"
