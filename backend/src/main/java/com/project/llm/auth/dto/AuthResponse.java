package com.project.llm.auth.dto;

public record AuthResponse(
        String token,
        String email,
        String nickname
) {
}
