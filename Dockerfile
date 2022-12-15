FROM eclipse-temurin:11.0.17_8-jdk-alpine

# change working directory to /opt/zimnat
WORKDIR /opt/zimnat

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src
COPY frontend-app ./frontend-app

CMD ["./mvnw", "spring-boot:run"]

# change working directory to frontend-app
RUN cd frontend-app

# build the front end app
#RUN npm run build

# change working directory back to base directory
RUN cd ../

# build the whole application (also copy built frontend-app to static resources folder)
CMD ["./mvnw", "clean install"]


#create an argument to use during copying
ARG JAR_FILE=target/zimnat-1.0.0.jar

# copy target/zimnat-1.0.0.jar.jar to /opt/app/zimnat-1.0.0.jar
COPY ${JAR_FILE} zimnat-1.0.0.jar

#inform docker that the container listens on port 8080 and 15672 at runtime
EXPOSE 8080
EXPOSE 5672
EXPOSE 15672

# java -jar /opt/app/app.jar
ENTRYPOINT ["java","-jar","zimnat-1.0.0.jar"]