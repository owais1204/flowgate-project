# FlowGate - Workflow Approval System

## Project Overview
FlowGate is a Workflow Approval Management System that automates request approvals between Employees, Managers, and Admins.

## Features
- Create Workflow Requests
- Manager Approval Process
- Admin Approval Process
- Dashboard Analytics
- Workflow History Tracking
- PostgreSQL Integration
- MongoDB Smart Search
- REST APIs using Spring Boot
- React Frontend

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Spring Boot
- Java 17

### Databases
- PostgreSQL
- MongoDB

## Workflow Process

Employee
↓
Manager Approval
↓
Admin Approval
↓
Completed

## Smart Search

MongoDB stores workflow documents and enables smart workflow search by:

- Title
- Category
- Description

Example Searches:

- Finance
- IT
- Budget
- Approval
- Security

## API Endpoints

GET /api/workflows

POST /api/workflows

GET /api/workflows/dashboard

GET /api/workflows/search

GET /api/workflows/smart-search?q=IT

PUT /api/workflows/{id}/manager-approve

PUT /api/workflows/{id}/approve

PUT /api/workflows/{id}/reject

## Databases Used

### PostgreSQL
Stores:
- Workflows
- Users
- Approval History

### MongoDB
Stores:
- workflow_embeddings

## Developed For

Hackathon Project 2026

Developer:
K Owais Khan
