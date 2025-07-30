#!/bin/bash

# Redis连接测试脚本

echo "=== Redis连接测试 ==="
echo "1. 检查Redis容器状态..."
docker ps | grep redis

echo -e "\n2. 测试Redis连接..."
docker exec pbl-agent-redis redis-cli ping

echo -e "\n3. 测试基本读写操作..."
docker exec pbl-agent-redis redis-cli set pbl_test "PBL Agent Redis Test"
result=$(docker exec pbl-agent-redis redis-cli get pbl_test)
echo "写入并读取测试数据: $result"

echo -e "\n4. 查看Redis版本和基本信息..."
docker exec pbl-agent-redis redis-cli info server | grep redis_version

echo -e "\n5. 查看数据库状态..."
docker exec pbl-agent-redis redis-cli info keyspace

echo -e "\nRedis服务测试完成！"