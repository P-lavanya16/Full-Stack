# Design Document

## 1. Tech Stack Choices

### Q1. Frontend Framework
**React**  
Used for its component-based structure, fast rendering, and ease of building dynamic UIs.

### Q2. Backend Framework
**Express.js**  
Chosen for simplicity, speed, middleware support, and easy file upload handling with Multer.

### Q3. Database
**MongoDB**  
Chosen for flexible schema and ease of storing dynamic metadata.

### Q4. Scaling for 1,000 Users
- Use AWS S3 for file storage
- Add user authentication
- Deploy backend on load-balanced infrastructure
- Use MongoDB Atlas for distributed database scaling

## 2. Architecture Overview
1. React frontend uploads PDF  
2. Express backend handles request  
3. Multer stores file in `uploads/`  
4. Metadata saved in MongoDB  
5. Frontend fetches and displays list  
6. Download/delete routes interact with stored files  

## 3. API Specification

### POST `/api/documents/upload`
Upload a PDF.

### GET `/api/documents`
List all documents.

### GET `/api/documents/:id`
Download a file.

### DELETE `/api/documents/:id`
Delete a file.

## 4. Data Flow Description

### Upload
1. User selects PDF  
2. React sends FormData  
3. Backend validates file  
4. Multer stores file  
5. Metadata inserted into MongoDB  
6. Response sent back  

### Download
1. React requests file by ID  
2. Backend locates file path  
3. File streamed back  

## 5. Assumptions
- One default user  
- Max 10MB per file  
- PDF only  
- Local filesystem storage  
- No auth required  

## Screenshots
![UI 1](scr1.png)
![UI 2](scr2.png)
![Postman](scr3.png)
