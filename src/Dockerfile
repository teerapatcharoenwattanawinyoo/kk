# Stage 1: Build
FROM node:18-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only lockfile and package.json
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build Next.js app
RUN pnpm run build

# Stage 2: Run
FROM node:18-alpine

# Enable pnpm in runtime image (if needed)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app ./

# Install only production dependencies (optional but good practice)
RUN pnpm install --prod

EXPOSE 3000
