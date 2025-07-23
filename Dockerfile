# ========================================
# Build Stage
# ========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies including devDependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# ========================================
# Production Stage
# ========================================
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache tini curl

# Create a non-root user to run the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built application and production dependencies
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/.env* ./

# Create necessary directories with correct permissions
RUN mkdir -p /app/logs && \
    chown -R appuser:appgroup /app/logs && \
    chmod -R 755 /app/logs

# Set environment variables
ENV NODE_ENV=production\
    PORT=5000\
    NODE_OPTIONS="--max-http-header-size=16384"\
    NODE_ENV=production\
    TZ=UTC

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Use tini as the init process
ENTRYPOINT ["/sbin/tini", "--"]

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 5000

# Start the application with proper signal handling
CMD ["node", "--trace-warnings", "--unhandled-rejections=strict", "dist/index.js"]

# Security headers (handled by Express/Helmet in the application code)
# Set secure defaults
ENV NODE_NO_WARNINGS=1\
    NPM_CONFIG_PRODUCTION=true\
    NPM_CONFIG_LOGLEVEL=warn\
    NPM_CONFIG_AUDIT=false\
    NPM_CONFIG_FUND=false\
    NPM_CONFIG_UPDATE_NOTIFIER=false

# Set the working directory to a non-root path
WORKDIR /app/dist

# Add a health check endpoint (handled in your Express app at /health)
