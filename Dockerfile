FROM node:18-slim

WORKDIR /app

# Copy package.json from server directory
COPY server/package.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy the rest of the server code
COPY server/ ./

ENV PORT=8080
EXPOSE 8080

# Run from the server directory
CMD ["node", "index.js"]