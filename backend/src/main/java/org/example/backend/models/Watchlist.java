package org.example.backend.models;

import org.springframework.data.annotation.Id;

import java.util.List;

public record Watchlist(@Id String id, String name, String description, List<String> itemIDs) {
}
