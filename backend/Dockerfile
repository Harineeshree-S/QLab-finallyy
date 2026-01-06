# Use official Node image
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Cloud Run typically sets PORT via env; default to 8080
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]
