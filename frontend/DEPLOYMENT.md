# 小红书助手 - Docker 部署指南

本文档提供在阿里云 ECS (Ubuntu 24.02) 上部署小红书助手的详细指南。

## 前置要求

### 服务器要求
- **操作系统**: Ubuntu 24.02 或更高版本
- **内存**: 至少 1GB RAM
- **磁盘**: 至少 10GB 可用空间
- **网络**: 公网 IP 地址

### 软件要求
- **Docker**: 最新版本 (推荐 24.0+)
- **Docker Compose**: 最新版本 (推荐 2.20+)

## 快速部署

### 方法一：使用部署脚本（推荐）

1. **上传项目文件到服务器**
   ```bash
   # 使用 scp 上传项目文件
   scp -r /path/to/rednote_assistent user@your-server-ip:/home/user/
   
   # 或使用 rsync
   rsync -avz /path/to/rednote_assistent user@your-server-ip:/home/user/
   ```

2. **SSH 登录到服务器**
   ```bash
   ssh user@your-server-ip
   ```

3. **进入项目目录**
   ```bash
   cd /home/user/rednote_assistent/frontend
   ```

4. **运行部署脚本**
   ```bash
   # 给脚本添加执行权限
   chmod +x deploy.sh
   
   # 运行部署脚本
   ./deploy.sh
   ```

5. **访问应用**
   打开浏览器访问：`http://your-server-ip`

### 方法二：手动部署

1. **构建 Docker 镜像**
   ```bash
   cd /path/to/rednote_assistent/frontend
   docker build -t rednote-assistent:latest .
   ```

2. **运行容器**
   ```bash
   docker run -d \
     --name rednote-assistent \
     -p 80:80 \
     --restart unless-stopped \
     rednote-assistent:latest
   ```

3. **访问应用**
   打开浏览器访问：`http://your-server-ip`

## 使用 Docker Compose 部署

### 创建 docker-compose.yml

在项目根目录创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  rednote-assistent:
    build: .
    container_name: rednote-assistent
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

### 启动服务

```bash
# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

## 配置 Nginx 反向代理（可选）

如果需要使用域名或 HTTPS，可以配置 Nginx 反向代理：

### 安装 Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 配置 Nginx

创建配置文件 `/etc/nginx/sites-available/rednote-assistent`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/rednote-assistent /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 配置 HTTPS（推荐）

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 防火墙配置

### Ubuntu UFW

```bash
# 允许 HTTP
sudo ufw allow 80/tcp

# 允许 HTTPS
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

### 阿里云安全组

在阿里云控制台配置安全组规则：

| 协议 | 端口范围 | 授权对象 | 描述 |
|------|-----------|-----------|------|
| TCP  | 80        | 0.0.0.0/0 | HTTP |
| TCP  | 443       | 0.0.0.0/0 | HTTPS |

## 常用命令

### 容器管理

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 查看容器日志
docker logs -f rednote-assistent

# 停止容器
docker stop rednote-assistent

# 启动容器
docker start rednote-assistent

# 重启容器
docker restart rednote-assistent

# 删除容器
docker rm -f rednote-assistent

# 进入容器
docker exec -it rednote-assistent sh
```

### 镜像管理

```bash
# 查看镜像
docker images

# 删除镜像
docker rmi rednote-assistent:latest

# 清理未使用的镜像
docker image prune -a
```

## 故障排除

### 问题：容器无法启动

```bash
# 查看容器日志
docker logs rednote-assistent

# 检查端口占用
sudo netstat -tulpn | grep :80

# 检查 Docker 服务状态
sudo systemctl status docker
```

### 问题：无法访问应用

1. 检查防火墙规则
2. 检查阿里云安全组配置
3. 确认容器正在运行
4. 检查 Nginx 配置（如果使用反向代理）

### 问题：应用加载缓慢

1. 检查服务器资源使用情况
   ```bash
   top
   htop
   ```

2. 检查磁盘空间
   ```bash
   df -h
   ```

3. 优化 Nginx 配置（已包含 Gzip 压缩）

## 监控和日志

### 查看应用日志

```bash
# 实时查看日志
docker logs -f rednote-assistent

# 查看最近 100 行日志
docker logs --tail 100 rednote-assistent
```

### 查看系统日志

```bash
# Docker 日志
sudo journalctl -u docker

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 更新部署

### 更新应用

```bash
# 停止并删除旧容器
docker stop rednote-assistent
docker rm rednote-assistent

# 删除旧镜像
docker rmi rednote-assistent:latest

# 拉取最新代码
git pull origin main

# 重新构建并运行
./deploy.sh
```

### 使用 Docker Compose 更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build

# 查看更新日志
docker-compose logs -f
```

## 安全建议

1. **定期更新**: 保持 Docker 和系统软件更新
2. **使用 HTTPS**: 配置 SSL 证书保护数据传输
3. **限制访问**: 使用防火墙限制不必要的访问
4. **监控日志**: 定期检查应用和系统日志
5. **备份数据**: 定期备份重要数据

## 性能优化

1. **启用 Gzip**: 已在 nginx.conf 中配置
2. **静态资源缓存**: 已在 nginx.conf 中配置
3. **使用 CDN**: 考虑使用阿里云 CDN 加速静态资源
4. **负载均衡**: 高流量时考虑使用负载均衡

## 联系支持

如有问题，请查看：
- 项目文档
- Docker 官方文档
- 阿里云 ECS 文档

## 许可证

本项目采用 MIT 许可证。
