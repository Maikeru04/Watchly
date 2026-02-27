package org.example.backend.models;

import lombok.With;
import org.springframework.data.annotation.Id;

import java.util.List;

@With
public record Watchlist(@Id String id, String userId, String name, String description, List<Item> items, String type) {
}
