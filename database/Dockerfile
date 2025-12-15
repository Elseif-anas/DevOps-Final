# MongoDB Dockerfile - Custom MongoDB with initialization
FROM mongo:7.0

# Set environment variables
ENV MONGO_INITDB_DATABASE=student_management

# Copy initialization script
COPY mongo-init.js /docker-entrypoint-initdb.d/

# Expose MongoDB port
EXPOSE 27017

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD mongosh --eval "db.adminCommand('ping')" || exit 1
