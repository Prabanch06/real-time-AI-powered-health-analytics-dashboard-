FROM node:22-slim

# Install system dependencies needed for better-sqlite3 and node-gyp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Vite frontend
RUN npm run build

# Expose the API port
EXPOSE 3001

# Set the environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the application using tsx since the server is TS
CMD ["npx", "tsx", "server/server.ts"]
