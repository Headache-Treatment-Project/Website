# 多階段構建 Dockerfile

# 第一階段：構建
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 複製 pom.xml 並下載依賴（利用 Docker 緩存）
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 複製源代碼並構建
COPY src ./src
RUN mvn clean package -DskipTests

# 第二階段：運行
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 創建非 root 用戶
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# 從構建階段複製 JAR
COPY --from=build /app/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/auth/health || exit 1

# 運行應用
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
