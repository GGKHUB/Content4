# Use Node.js 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install all dependencies (including dev for build)
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build Angular application
RUN cd client && npm run build --configuration production

# Create uploads directory
RUN mkdir -p ./server/uploads

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["node", "server/index.js"]