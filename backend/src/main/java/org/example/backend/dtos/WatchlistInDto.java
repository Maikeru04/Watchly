package org.example.backend.dtos;

import lombok.With;

import java.util.List;

@With
public record WatchlistInDto(String name, String description) {
}
