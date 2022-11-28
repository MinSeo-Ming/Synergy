# Start with a base image containing Java runtime
FROM openjdk:11

# Add Author info 
LABEL maintainer="name@gmail.com"

# Add a volume to /tmp
VOLUME /tmp

# Make port 8080 available to the world outside this container
EXPOSE 8080

# The application's jar file
ARG JAR_FILE=build/libs/synergy-web-project-1.0-SNAPSHOT.jar

# Add the application's jar to the container
ADD ${JAR_FILE} a306.jar

# Run the jar file
ENTRYPOINT ["java","-jar","/a306.jar"]