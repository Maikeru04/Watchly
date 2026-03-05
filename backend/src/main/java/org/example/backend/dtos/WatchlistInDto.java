package org.example.backend.dtos;

import lombok.With;

@With
public record WatchlistInDto(String name, String description, String type) {
}
