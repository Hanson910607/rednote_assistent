# Docker 部署配置文件

# 构建镜像
docker build -t rednote-assistent:latest .

# 运行容器
docker run -d -p 80:80 --name rednote-assistent rednote-assistent:latest

# 部署到阿里云 ECS
# 1. 将 Dockerfile 和 nginx.conf 上传到服务器
# 2. 在服务器上构建镜像
docker build -t rednote-assistent:latest .

# 3. 运行容器
docker run -d -p 80:80 --name rednote-assistent rednote-assistent:latest

# 4. 配置 Nginx 反向代理（如果需要）
# 在服务器上创建 /etc/nginx/conf.d/rednote-assistent.conf
# 内容：
# server {
#     listen 80;
#     server_name your-domain.com;
#     
#     location / {
#         proxy_pass http://localhost:8080;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#     }
# }

# 5. 重启 Nginx
# nginx -s reload

# 查看日志
docker logs -f rednote-assistent

# 停止容器
docker stop rednote-assistent

# 删除容器
docker rm rednote-assistent

# 删除镜像
docker rmi rednote-assistent:latest

# 更新部署
docker stop rednote-assistent
docker rm rednote-assistent
docker rmi rednote-assistent:latest
docker build -t rednote-assistent:latest .
docker run -d -p 80:80 --name rednote-assistent rednote-assistent:latest
