.PHONY: dev

dev:
	@echo "Starting backend and frontend..."
	@echo "Press Ctrl+C to stop both servers."
	@(trap 'kill 0' INT TERM; \
	cd backend && go run main.go & \
	cd frontend && NG_CLI_ANALYTICS=false npm start & \
	wait)
