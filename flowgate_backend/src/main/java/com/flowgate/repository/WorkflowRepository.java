package com.flowgate.repository;

import com.flowgate.model.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkflowRepository extends JpaRepository<Workflow, Long> {

    List<Workflow> findByStatus(String status);

    List<Workflow> findByAssignedTo(String assignedTo);

    List<Workflow> findByCreatedBy(String createdBy);

    List<Workflow> findByTitleContainingIgnoreCase(String query);
}