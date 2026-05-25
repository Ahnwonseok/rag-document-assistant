package com.project.llm.chat.dto;

import java.util.List;

public record ChatResponse(
        String answer,
        List<SourceInfo> sources
) {
    public record SourceInfo(
            String content,
            String documentTitle,
            double score
    ) {
    }
}
