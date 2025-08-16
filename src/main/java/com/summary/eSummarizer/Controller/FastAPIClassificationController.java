package com.summary.eSummarizer.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.summary.eSummarizer.DTO.ClassificationRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/classification")
public class FastAPIClassificationController {

    private final WebClient webClient = WebClient.create("http://localhost:8000");
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/classify")
    public Mono<ResponseEntity<Map<String, String>>> classify(@RequestBody ClassificationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return Mono.just(ResponseEntity.status(401).body(Map.of("Error", "Login to Classify the text")));
        }


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
                        System.out.println("this is predicted Class: " + predictedClass);
                        return ResponseEntity.ok(Map.of("predictedClass", predictedClass));

                    } catch (Exception e) {
                        return ResponseEntity.internalServerError().body(Map.of("error", "Failed to parse predicted_class"));
                    }
                });
    }


}