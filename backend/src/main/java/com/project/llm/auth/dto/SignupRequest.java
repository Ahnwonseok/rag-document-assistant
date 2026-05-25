package com.project.llm.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
        @NotBlank String email,
        @NotBlank String password,
        @NotBlank String nickname
) {
}
