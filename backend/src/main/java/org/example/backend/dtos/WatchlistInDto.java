package org.example.backend.dtos;

import java.util.List;

public record WatchlistInDto(String name, String description, List<String> itemIDs) {
}
