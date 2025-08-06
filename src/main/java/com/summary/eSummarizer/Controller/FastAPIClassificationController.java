package com.summary.eSummarizer.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.summary.eSummarizer.DTO.ClassificationRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/classification")
public class FastAPIClassificationController {

    private final WebClient webClient = WebClient.create("http://localhost:8000");
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/classify")
    public Mono<ResponseEntity<String>> classify(@RequestBody ClassificationRequest request) {
        return webClient.post()
                .uri("/api/v1/classify")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .map(responseBody -> {
                    try {
                        JsonNode jsonNode = objectMapper.readTree(responseBody);
                        String predictedClass = jsonNode.get("predicted_class").asText();
                        return ResponseEntity.ok(predictedClass);
                    } catch (Exception e) {
                        return ResponseEntity.internalServerError().body("Failed to parse predicted_class");
                    }
                });
    }


}