# Docker 部署指南 - 阿里云 ECS

## 版本信息
- 版本：v1.0.0
- 更新日期：2024-02-11

## 前置要求

### 1. 安装 Docker
```bash
# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 准备代码
```bash
# 克隆代码仓库
git clone <your-repo-url> rednote-assistent
cd rednote-assistent

# 或者下载代码包
# 解压代码包
unzip rednote-assistent.zip
cd rednote-assistent
```

### 3. 构建并运行
```bash
# 使用 Docker Compose 构建并运行
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

### 4. 阿里云 ECS 部署

#### 4.1 使用 Docker Compose（推荐）

```bash
# 上传代码到 ECS
scp -r rednote-assistent root@your-ecs-ip:/root/

# SSH 连接到 ECS
ssh root@your-ecs-ip

# 进入项目目录
cd /root/rednote-assistent

# 启动服务
docker-compose up -d --build
```

#### 4.2 使用 Docker 命令

```bash
# 构建镜像
docker build -t rednote-assistent:v1.0.0 .

# 运行容器
docker run -d -p 80:80 --name rednote-assistent rednote-assistent:v1.0.0

# 查看容器状态
docker ps

# 查看容器日志
docker logs rednote-assistent

# 停止容器
docker stop rednote-assistent

# 删除容器
docker rm rednote-assistent

# 删除镜像
docker rmi rednote-assistent:v1.0.0
```

### 5. 配置防火墙

```bash
# 开放 80 端口
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload

# 或者使用 iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo service iptables save
```

### 6. 配置 Nginx 反向代理（可选）

如果需要使用域名访问，可以配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7. 配置 SSL 证书（可选）

如果需要 HTTPS 访问，可以配置 SSL 证书：

```bash
# 使用 Let's Encrypt 免费证书
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 或者使用已有的证书
# 将证书文件上传到 ECS
# 修改 nginx.conf 添加 SSL 配置
```

### 8. 监控和维护

#### 查看日志
```bash
# 查看应用日志
docker-compose logs -f app

# 查看特定服务的日志
docker logs rednote-assistent
```

#### 更新应用
```bash
# 拉取最新代码
git pull

# 重新构建并运行
docker-compose down
docker-compose up -d --build
```

#### 备份数据
```bash
# 备份数据库（如果有）
docker exec rednote-assistent mongodump --out backup_$(date +%Y%m%d_%H%M%S).bson

# 备份配置文件
docker cp rednote-assistent:/app/.env ./backup/.env.backup
```

### 9. 故障排查

#### 容器无法启动
```bash
# 查看容器日志
docker-compose logs -f

# 检查端口占用
netstat -tunlp | grep :80
lsof -i :80

# 检查防火墙
sudo firewall-cmd --list-all
sudo iptables -L -n -v
```

#### 应用无法访问
```bash
# 检查容器状态
docker ps

# 检查网络连接
docker network inspect rednote-network

# 检查 DNS 解析
nslookup your-domain.com
dig your-domain.com
```

### 10. 性能优化

#### 使用多阶段构建
Dockerfile 已经使用多阶段构建，减少镜像大小

#### 使用 .dockerignore
排除不必要的文件，加快构建速度

#### 使用生产环境变量
设置 NODE_ENV=production，启用生产模式优化

### 11. 安全建议

#### 限制容器权限
```bash
# 不要使用 root 用户运行应用
# 在 Dockerfile 中添加 USER 指令
```

#### 使用只读文件系统
```dockerfile
# 添加只读层
RUN --mount=type=bind,ro /app/node_modules
```

#### 定期更新
```bash
# 定期更新基础镜像
docker pull node:18-alpine
docker pull nginx:alpine
```

### 12. 备份和恢复

#### 备份部署
```bash
# 导出当前配置
docker-compose config > docker-compose.backup.yml

# 导出镜像
docker save rednote-assistent:v1.0.0 | gzip > rednote-assistent-backup.tar.gz
```

#### 恢复部署
```bash
# 从备份恢复
docker load < rednote-assistent-backup.tar.gz
docker-compose up -d
```

## 联系方式

如有问题，请联系：
- 技术支持：support@example.com
- 项目地址：https://github.com/your-repo/rednote-assistent

## 附录

### A. 环境变量

| 变量名 | 说明 | 默认值 |
|---------|------|---------|
| NODE_ENV | 运行环境 | production |
| PORT | 后端端口 | 3000 |

### B. 端口映射

| 容器端口 | 宿主机端口 | 说明 |
|-----------|-----------|------|
| 80 | 80 | HTTP 访问端口 |

### C. 目录结构

```
rednote-assistent/
├── Dockerfile              # Docker 构建文件
├── docker-compose.yml      # Docker Compose 配置
├── nginx.conf             # Nginx 配置
├── .dockerignore          # Docker 忽略文件
├── frontend/             # 前端代码
│   ├── src/
│   ├── package.json
│   └── ...
├── server.js              # 后端代码
└── package.json           # 根目录依赖
```
