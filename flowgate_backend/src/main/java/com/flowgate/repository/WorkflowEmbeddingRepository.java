package com.flowgate.repository;

import com.flowgate.model.WorkflowEmbedding;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WorkflowEmbeddingRepository
        extends MongoRepository<WorkflowEmbedding, String> {

    List<WorkflowEmbedding>
    findByTitleContainingIgnoreCase(String query);

    List<WorkflowEmbedding>
    findByCategoryContainingIgnoreCase(String query);

    List<WorkflowEmbedding>
    findByDescriptionContainingIgnoreCase(String query);
}