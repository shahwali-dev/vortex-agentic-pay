# -*- mode: python -*-

# Load the modern versionless docker-compose specification
docker_compose('docker-compose.yml')

# Surface the explicit microservice endpoints directly onto the Tilt Dashboard
link('Web Frontend', 'http://localhost:3000')
link('X402 Payment Server', 'http://localhost:4402')
link('Venice AI Agent', 'http://localhost:3001')

# Fast file-watching synchronization for monorepo workspaces
watch_file('./apps/web-app/src')
watch_file('./apps/x402-server/src')
watch_file('./packages/venice-agent/src')
watch_file('./packages/smart-account-core/src')