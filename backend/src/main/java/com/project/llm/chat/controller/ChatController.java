package com.project.llm.chat.controller;

import com.project.llm.chat.dto.ChatRequest;
import com.project.llm.chat.dto.ChatResponse;
import com.project.llm.chat.entity.ChatMessage;
import com.project.llm.chat.repository.ChatMessageRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final RestTemplate restTemplate;

    @Value("${ai-service.url}")
    private String aiServiceUrl;

    public ChatController(ChatMessageRepository chatMessageRepository, RestTemplate restTemplate) {
        this.chatMessageRepository = chatMessageRepository;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(@Valid @RequestBody ChatRequest request) {
        Map<String, String> body = Map.of(
                "question", request.question(),
                "session_id", request.sessionId() != null ? request.sessionId() : ""
        );

        ChatResponse response = restTemplate.postForObject(
                aiServiceUrl + "/api/chat/ask",
                body,
                ChatResponse.class
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String sessionId) {
        List<ChatMessage> messages = chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        return ResponseEntity.ok(messages);
    }
}
