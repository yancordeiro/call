# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY backend/ ./backend/

# Build the application
WORKDIR /app/backend
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/api

# Production stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/server .

# Copy migrations
COPY backend/migrations ./migrations

EXPOSE 8080

CMD ["./server"]
