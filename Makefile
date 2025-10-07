# SeeyGo 项目 Makefile

# 变量定义
.PHONY: dev build start lint format clean help

# 开发环境
dev:
	pnpm dev

# 构建生产版本
build:
	pnpm build

# 启动生产服务器
start:
	pnpm start

# 代码检查
lint:
	pnpm lint

# 代码格式化
format:
	pnpm format

# 清理构建产物
clean:
	rm -rf .next
	rm -rf node_modules/.cache

# 帮助信息
help:
	@echo "SeeyGo 项目命令"
	@echo "----------------------------------------------------------------"
	@echo "dev     - 启动开发服务器"
	@echo "build   - 构建生产版本"
	@echo "start   - 启动生产服务器"
	@echo "lint    - 代码检查"
	@echo "format  - 代码格式化"
	@echo "clean   - 清理构建产物"
	@echo "help    - 显示帮助信息"