#!/bin/bash

# 部署脚本 - 用于在阿里云 ECS 上部署小红书助手

set -e

echo "=========================================="
echo "小红书助手 - Docker 部署脚本"
echo "=========================================="

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    print_error "Docker 未安装，请先安装 Docker"
    exit 1
fi

print_success "Docker 已安装"

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

print_success "Docker Compose 已安装"

# 停止并删除旧容器
echo ""
echo "停止旧容器..."
docker stop rednote-assistent 2>/dev/null || true
docker rm rednote-assistent 2>/dev/null || true
print_success "旧容器已清理"

# 删除旧镜像
echo ""
echo "删除旧镜像..."
docker rmi rednote-assistent:latest 2>/dev/null || true
print_success "旧镜像已删除"

# 构建新镜像
echo ""
echo "构建新镜像..."
docker build -t rednote-assistent:latest .
if [ $? -eq 0 ]; then
    print_success "镜像构建成功"
else
    print_error "镜像构建失败"
    exit 1
fi

# 运行容器
echo ""
echo "启动容器..."
docker run -d \
    --name rednote-assistent \
    -p 80:80 \
    --restart unless-stopped \
    rednote-assistent:latest

if [ $? -eq 0 ]; then
    print_success "容器启动成功"
    echo ""
    echo "=========================================="
    echo "部署完成！"
    echo "=========================================="
    echo ""
    echo "应用已成功部署到 Docker 容器中"
    echo ""
    echo "访问地址：http://localhost"
    echo ""
    echo "查看日志："
    echo "  docker logs -f rednote-assistent"
    echo ""
    echo "停止容器："
    echo "  docker stop rednote-assistent"
    echo ""
    echo "启动容器："
    echo "  docker start rednote-assistent"
    echo ""
    echo "删除容器："
    echo "  docker rm -f rednote-assistent"
    echo ""
    echo "=========================================="
else
    print_error "容器启动失败"
    exit 1
fi
