FROM node:lts-alpine AS base

WORKDIR /app

RUN \
  --mount=type=bind,source=./.yarnrc.yml,target=./.yarnrc.yml \
  --mount=type=bind,source=./yarn.lock,target=./yarn.lock \
  --mount=type=bind,source=./package.json,target=./package.json \
  corepack enable \
  && corepack prepare yarn@4.9.2 --activate

FROM base AS builder

# Install all dependencies (including devDependencies needed for building)
# Use mount cache for node_modules to speed up subsequent builds
RUN --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./yarn.lock,target=./yarn.lock \
    --mount=type=bind,source=./tsconfig.json,target=./tsconfig.json \
    --mount=type=bind,source=./.yarnrc.yml,target=./.yarnrc.yml \
    --mount=type=bind,source=./src,target=./src \
    --mount=type=cache,target=./node_modules \
    yarn workspaces focus \
    && yarn build

FROM base AS production

# Install only production dependencies
# Use mount cache for node_modules to speed up subsequent builds
RUN --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./yarn.lock,target=./yarn.lock \
    --mount=type=bind,source=./.yarnrc.yml,target=./.yarnrc.yml \
    --mount=type=cache,target=./node_modules \
    yarn workspaces focus --production \
    && yarn cache clean \
    && cp -r node_modules deps 

FROM node:lts-alpine

LABEL maintainer="Stephane Segning <selastlambou@gmail.com>"
LABEL org.opencontainers.image.description="Quiz Backend for the SSchool"

WORKDIR /app

# Create a non-root user and group for better security
RUN addgroup -S -g 1001 nodejs && adduser -S nestjs -G nodejs -u 1001

# Copy built application from the builder stage using mount
COPY --from=production /app/deps ./node_modules
COPY --from=builder /app/dist ./dist

# .env file should be provided at runtime, not copied into the image.
# Example: docker run -p 3000:3000 --env-file ./.env quiz-backend

# Set ownership of the application files to the non-root user
RUN chown -R nestjs:nodejs /app

# Switch to the non-root user
USER nestjs

# Expose the port the application runs on.
# Your src/main.ts uses process.env.PORT or defaults to 3000.
# The .env file provided does not set a PORT, so it will default to 3000.
EXPOSE 3000

# Command to run the application.
# This corresponds to the "start:prod": "node dist/main" script in your package.json.
ENTRYPOINT [ "node", "/app/dist/main.js"]