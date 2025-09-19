FROM node:18-slim

# Set working directory inside container
WORKDIR /app

# Copy package.json and install deps
COPY server/package.json ./
RUN npm install --production

# Copy the entire server (including /public now inside)
COPY server ./

# Env & port
ENV PORT=8080
EXPOSE 8080

# Run the app
CMD ["node", "index.js"]
