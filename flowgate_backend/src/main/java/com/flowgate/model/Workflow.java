package com.flowgate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflows")
public class Workflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    private String department;

    private String priority;

    private String status;

    private String createdBy;

    private String assignedTo;

    private String approvedBy;

    @Column(columnDefinition = "TEXT")
    private String comments;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    public Workflow() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public String getTitle() { return title; }

    public String getDescription() { return description; }

    public String getCategory() { return category; }

    public String getDepartment() { return department; }

    public String getPriority() { return priority; }

    public String getStatus() { return status; }

    public String getCreatedBy() { return createdBy; }

    public String getAssignedTo() { return assignedTo; }

    public String getApprovedBy() { return approvedBy; }

    public String getComments() { return comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }

    public void setTitle(String title) { this.title = title; }

    public void setDescription(String description) { this.description = description; }

    public void setCategory(String category) { this.category = category; }

    public void setDepartment(String department) { this.department = department; }

    public void setPriority(String priority) { this.priority = priority; }

    public void setStatus(String status) { this.status = status; }

    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public void setComments(String comments) { this.comments = comments; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}