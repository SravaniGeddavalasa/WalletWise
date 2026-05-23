# ----------------------------------------------------
# Stage 1: Build the Spring Boot application
# ----------------------------------------------------
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml first (for dependency caching)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Convert CRLF to LF in case the wrapper was checked out on Windows
# Ensure the wrapper is executable
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Download dependencies offline to speed up subsequent builds
RUN ./mvnw dependency:go-offline -B

# Copy the actual application source code
COPY src ./src

# Package the application (skip tests for faster production builds)
RUN ./mvnw clean package -DskipTests

# ----------------------------------------------------
# Stage 2: Create the production-ready image
# ----------------------------------------------------
FROM eclipse-temurin:17-jre-alpine

# Set deployment directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
