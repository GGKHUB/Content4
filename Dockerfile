# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd client && npm ci --only=production

# Copy source code
COPY . .

# Build Angular application
RUN cd client && npm run build --prod

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built Angular app to server
COPY --from=builder /app/client/dist/car-enthusiasts-client ./client/dist

# Copy server files
COPY server/ ./server/
COPY --from=builder /app/server/uploads ./server/uploads

# Create uploads directory if it doesn't exist
RUN mkdir -p ./server/uploads

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["node", "server/index.js"]
