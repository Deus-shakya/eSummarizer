package com.summary.eSummarizer.Controller;// ...existing code...

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.summary.eSummarizer.DTO.SummarizationRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/summarization")
public class FastAPISummarizationController {

    private final WebClient webClient = WebClient.create("http://localhost:8000");
    private final ObjectMapper objectMapper = new ObjectMapper();


    @PostMapping("/summarize")
    public Mono<ResponseEntity<String>> summarize(@RequestBody SummarizationRequest request) {
        return webClient.post()
                .uri("/api/v1/summarize")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .map(responseBody -> {
                    try {
                        JsonNode jsonNode = objectMapper.readTree(responseBody);
                        String summary = jsonNode.get("summary").asText();
                        return ResponseEntity.ok(summary);
                    } catch (Exception e) {
                        return ResponseEntity.internalServerError().body("Failed to parse summary");
                    }
                });
    }
}

