# JobLink - Connect. Apply. Hire

JobLink is a Spring Boot microservices-based job portal application that allows users to search and apply for jobs while companies can post and manage job listings.

## Tech Stack

- Java 17
- Spring Boot
- Spring Cloud
- Spring Data JPA
- Spring Security (JWT)
- OAuth2
- Spring Cloud Gateway
- Eureka Service Discovery
- MySQL
- Maven

## Project Structure

```
JobLink
│── api-gateway
│── application-service
│── company-service
│── eureka-server
│── job-posting-service
│── notification-service
│── profile-service
│── user-service
└── pom.xml
```

## Microservices

### Eureka Server
- Service registry for all microservices.

### API Gateway
- Single entry point for client requests.
- Routes requests to appropriate services.

### User Service
- User registration and authentication.
- User management.

### Profile Service
- Stores and manages user profile information.

### Company Service
- Company registration and profile management.

### Job Posting Service
- Create, update, delete, and search job postings.

### Application Service
- Handles job applications submitted by users.

### Notification Service
- Sends notifications for important events.

## Prerequisites

- Java 17
- Maven
- MySQL

## Running the Project

1. Clone the repository

```bash
git clone <repository-url>
cd JobLink
```

2. Build the project

```bash
mvn clean install
```

3. Start the services in the following order:

1. Eureka Server
2. API Gateway
3. User Service
4. Profile Service
5. Company Service
6. Job Posting Service
7. Application Service
8. Notification Service

## Features

- User registration and login
- Company registration
- Job posting management
- Job applications
- User profiles
- Service discovery with Eureka
- API Gateway routing
- Notification service

## Future Enhancements

- Docker support
- Kubernetes deployment
- CI/CD pipeline

## Authors

Developed as a learning project using Spring Boot Microservices.
