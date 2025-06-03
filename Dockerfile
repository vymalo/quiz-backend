# Stage 1: Build the application
FROM node:lts-alpine AS builder
LABEL stage="builder"

WORKDIR /app

# Install all dependencies (including devDependencies needed for building)
# Use mount cache for node_modules to speed up subsequent builds
RUN --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./yarn.lock,target=./yarn.lock \
    --mount=type=bind,source=./tsconfig.json,target=./tsconfig.json \
    --mount=type=bind,source=./src,target=./src \
    --mount=type=cache,target=/app/node_modules \
    yarn install --frozen-lockfile && \
    yarn build


# Stage 2: Create the production image
FROM node:23-alpine AS production

WORKDIR /app

# Create a non-root user and group for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install only production dependencies
# Use mount cache for node_modules to speed up subsequent builds
RUN --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./yarn.lock,target=./yarn.lock \
    yarn install --production --frozen-lockfile \
    && yarn cache clean

# Copy built application from the builder stage using mount
COPY --from=builder /app/dist .

# .env file should be provided at runtime, not copied into the image.
# Example: docker run -p 3000:3000 --env-file ./.env quiz-backend

# Set ownership of the application files to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the port the application runs on.
# Your src/main.ts uses process.env.PORT or defaults to 3000.
# The .env file provided does not set a PORT, so it will default to 3000.
EXPOSE 3000

# Command to run the application.
# This corresponds to the "start:prod": "node dist/main" script in your package.json.
ENTRYPOINT [ "node", "main.js"]