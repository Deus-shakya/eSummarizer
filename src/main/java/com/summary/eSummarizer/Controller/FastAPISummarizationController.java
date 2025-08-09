package com.summary.eSummarizer.Controller;// ...existing code...

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.summary.eSummarizer.DTO.SummarizationRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/summarization")
public class FastAPISummarizationController {

    private final WebClient webClient = WebClient.create("http://localhost:8000");
    private final ObjectMapper objectMapper = new ObjectMapper();


    @PostMapping("/summarize-abs")
    public Mono<ResponseEntity<Map<String,String>>> summarize(@RequestBody SummarizationRequest request) {
        return webClient.post()
                .uri("/api/v1/summarize")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .map(responseBody -> {
                    try {
                        JsonNode jsonNode = objectMapper.readTree(responseBody);
                        System.out.println("this is from fastAPIReturned to spring: "+jsonNode);
                        String summary = jsonNode.get("summary").asText();
                        return ResponseEntity.ok(Map.of("summarizedText",summary));
                    } catch (Exception e) {
                        return ResponseEntity.internalServerError().body(Map.of("Error","Failed to process the data"));

                    }
                });
    }
}

