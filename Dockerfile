FROM node:18-slim

WORKDIR /app

# Copy package.json and install dependencies
COPY server/package.json ./
RUN npm install --production

# Copy the entire server directory
COPY server/ ./

# Debug: List contents to verify files are copied
RUN ls -la && ls -la public/

ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]