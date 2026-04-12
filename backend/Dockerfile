# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 9000

# Wait for postgres and run migrations, then start the app
CMD ["sh", "-c", "npm run db:push && npm run db:seed && npm start"]