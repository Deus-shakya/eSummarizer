package com.summary.eSummarizer.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.summary.eSummarizer.DTO.ClassificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/classification")
public class FastAPIClassificationController {

    private static final Logger logger = LoggerFactory.getLogger(FastAPIClassificationController.class);

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FastAPIClassificationController(@Value("${external.api.base-url}") String baseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    @PostMapping("/classify")
    public Mono<ResponseEntity<Map<String, String>>> classify(@RequestBody ClassificationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return Mono.just(ResponseEntity.status(401).body(Map.of("Error", "Login to Classify the text")));
        }

        logger.info("Sending classification request to FastAPI: {}", request);

        return webClient.post()
                .uri("/api/v1/classify")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .flatMap(body -> {
                                    logger.error("FastAPI returned error {}: {}", clientResponse.statusCode(), body);
                                    return Mono.error(new RuntimeException("FastAPI returned error"));
                                }))
                .bodyToMono(String.class)
                .doOnNext(body -> logger.info("FastAPI response body: {}", body))
                .retryWhen(reactor.util.retry.Retry.backoff(5, Duration.ofSeconds(2))
                        .filter(throwable -> throwable instanceof WebClientResponseException))
                .map(responseBody -> {
                    try {
                        JsonNode jsonNode = objectMapper.readTree(responseBody);
                        String predictedClass = jsonNode.get("predicted_class").asText();
                        logger.info("Predicted class: {}", predictedClass);
                        return ResponseEntity.ok(Map.of("predictedClass", predictedClass));

                    } catch (Exception e) {
                        logger.error("Failed to parse predicted_class", e);
                        return ResponseEntity.internalServerError()
                                .body(Map.of("error", "Failed to parse predicted_class"));
                    }
                });
    }
}
