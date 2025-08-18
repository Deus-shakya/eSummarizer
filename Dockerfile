FROM amazoncorretto:22
WORKDIR /app
COPY target/Gistify-0.0.1-SNAPSHOT.jar app.jar
#Expose the default Spring Boot port
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]