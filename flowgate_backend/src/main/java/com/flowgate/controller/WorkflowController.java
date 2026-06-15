package com.flowgate.controller;

import com.flowgate.model.Workflow;
import com.flowgate.model.WorkflowEmbedding;
import com.flowgate.model.WorkflowLog;

import com.flowgate.repository.WorkflowEmbeddingRepository;
import com.flowgate.repository.WorkflowLogRepository;
import com.flowgate.repository.WorkflowRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/workflows")
@CrossOrigin("*")
public class WorkflowController {

    private final WorkflowRepository workflowRepository;
    private final WorkflowLogRepository workflowLogRepository;
    private final WorkflowEmbeddingRepository workflowEmbeddingRepository;

    public WorkflowController(
            WorkflowRepository workflowRepository,
            WorkflowLogRepository workflowLogRepository,
            WorkflowEmbeddingRepository workflowEmbeddingRepository
    ) {
        this.workflowRepository = workflowRepository;
        this.workflowLogRepository = workflowLogRepository;
        this.workflowEmbeddingRepository = workflowEmbeddingRepository;
    }

    // =====================================
    // CREATE WORKFLOW
    // =====================================

    @PostMapping
    public Workflow create(@RequestBody Workflow workflow) {

        workflow.setStatus("Pending Manager Approval");
        workflow.setCreatedAt(LocalDateTime.now());

        if (workflow.getCreatedBy() == null) {
            workflow.setCreatedBy("Employee");
        }

        if (workflow.getAssignedTo() == null) {
            workflow.setAssignedTo("MANAGER");
        }
        
        workflow.setCurrentApprover("MANAGER");

        Workflow saved = workflowRepository.save(workflow);

        WorkflowEmbedding embedding = new WorkflowEmbedding();
        embedding.setWorkflowId(saved.getId());
        embedding.setTitle(saved.getTitle());
        embedding.setDescription(saved.getDescription());
        embedding.setCategory(saved.getCategory());
        embedding.setDepartment(saved.getDepartment());
        embedding.setPriority(saved.getPriority());
        embedding.setStatus(saved.getStatus());
        embedding.setCreatedAt(saved.getCreatedAt());

        workflowEmbeddingRepository.save(embedding);

        WorkflowLog log = new WorkflowLog();
        log.setWorkflowId(saved.getId());
        log.setAction("Workflow Created");
        log.setPerformedBy(saved.getCreatedBy());

        workflowLogRepository.save(log);

        return saved;
    }

    // =====================================
    // GET ALL WORKFLOWS
    // =====================================

    @GetMapping
    public List<Workflow> getAll() {
        return workflowRepository.findAll();
    }

    // =====================================
    // GET WORKFLOW BY ID
    // =====================================

    @GetMapping("/{id}")
    public Workflow getById(@PathVariable Long id) {
        return workflowRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Workflow Not Found"));
    }

    // =====================================
    // MANAGER QUEUE
    // =====================================

    @GetMapping("/manager")
    public List<Workflow> managerQueue() {
        return workflowRepository.findByAssignedTo("MANAGER");
    }

    // =====================================
    // ADMIN QUEUE
    // =====================================

    @GetMapping("/admin")
    public List<Workflow> adminQueue() {
        return workflowRepository.findByAssignedTo("ADMIN");
    }

    // =====================================
    // SUBMITTER QUEUE
    // =====================================

    @GetMapping("/submitter/{name}")
    public List<Workflow> submitterQueue(@PathVariable String name) {
        return workflowRepository.findByCreatedBy(name);
    }

    // =====================================
    // MANAGER APPROVE
    // =====================================

    @PutMapping("/{id}/manager-approve")
    public Workflow managerApprove(@PathVariable Long id) {

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Workflow Not Found"));
        if (!"MANAGER".equals(workflow.getCurrentApprover())) {
            throw new RuntimeException(
                    "This workflow is not waiting for Manager approval");
        }

        workflow.setAssignedTo("ADMIN");
        workflow.setCurrentApprover("ADMIN");
        workflow.setStatus("Pending Admin Approval");

        workflowRepository.save(workflow);

        WorkflowLog log = new WorkflowLog();
        log.setWorkflowId(workflow.getId());
        log.setAction("Manager Approved");
        log.setPerformedBy("MANAGER");

        workflowLogRepository.save(log);

        return workflow;
    }

   
    // =====================================
    // ADMIN APPROVE
    // =====================================

    @PutMapping("/{id}/approve")
    public Workflow approve(@PathVariable Long id) {

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Workflow Not Found"));

        if (!"ADMIN".equals(workflow.getCurrentApprover())) {
            throw new RuntimeException(
                    "Manager approval required first");
        }

        workflow.setStatus("Approved");
        workflow.setApprovedBy("ADMIN");
        workflow.setAssignedTo("COMPLETED");
        workflow.setCurrentApprover("COMPLETED");
        workflow.setApprovedAt(LocalDateTime.now());

        workflowRepository.save(workflow);

        WorkflowLog log = new WorkflowLog();
        log.setWorkflowId(workflow.getId());
        log.setAction("Admin Approved");
        log.setPerformedBy("ADMIN");

        workflowLogRepository.save(log);

        return workflow;
    }

    // =====================================
    // REJECT
    // =====================================
    @PutMapping("/{id}/reject")
    public Workflow reject(@PathVariable Long id) {

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Workflow Not Found"));

        workflow.setStatus("Rejected");
        workflow.setCurrentApprover("COMPLETED");
        workflow.setApprovedBy("ADMIN");
        workflow.setApprovedAt(LocalDateTime.now());

        workflowRepository.save(workflow);

        WorkflowLog log = new WorkflowLog();
        log.setWorkflowId(workflow.getId());
        log.setAction("Workflow Rejected");
        log.setPerformedBy("ADMIN");

        workflowLogRepository.save(log);

        return workflow;
    }

    // =====================================
    // WORKFLOW HISTORY
    // =====================================

    @GetMapping("/{id}/history")
    public List<WorkflowLog> history(@PathVariable Long id) {
        return workflowLogRepository.findByWorkflowId(id);
    }

    // =====================================
    // DASHBOARD
    // =====================================

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {

        List<Workflow> workflows = workflowRepository.findAll();

        long pending = workflows.stream()
                .filter(w -> w.getStatus() != null &&
                        w.getStatus().contains("Pending"))
                .count();

        long approved = workflows.stream()
                .filter(w -> "Approved".equalsIgnoreCase(w.getStatus()))
                .count();

        long rejected = workflows.stream()
                .filter(w -> "Rejected".equalsIgnoreCase(w.getStatus()))
                .count();

        Map<String, Object> data = new HashMap<>();

        data.put("totalWorkflows", workflows.size());
        data.put("pendingCount", pending);
        data.put("approvedCount", approved);
        data.put("rejectedCount", rejected);
        data.put("inReviewCount", 0);
        data.put("draftCount", 0);
        data.put("recentWorkflows", workflows);
        data.put("myPendingApprovals", new ArrayList<>());

        return data;
    }

    // =====================================
    // POSTGRES SEARCH
    // =====================================

    @GetMapping("/search")
    public List<Workflow> search(@RequestParam String q) {
        return workflowRepository.findByTitleContainingIgnoreCase(q);
    }

    // =====================================
    // MONGODB SMART SEARCH
    // =====================================

    @GetMapping("/smart-search")
    public List<WorkflowEmbedding> smartSearch(@RequestParam String q) {

        List<WorkflowEmbedding> results = new ArrayList<>();

        results.addAll(
                workflowEmbeddingRepository.findByTitleContainingIgnoreCase(q)
        );

        results.addAll(
                workflowEmbeddingRepository.findByCategoryContainingIgnoreCase(q)
        );

        results.addAll(
                workflowEmbeddingRepository.findByDescriptionContainingIgnoreCase(q)
        );

        return results;
    }
}