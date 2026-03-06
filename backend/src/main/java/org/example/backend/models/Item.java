package org.example.backend.models;

import lombok.With;

@With
public record Item(String itemID, String media_type, double rating) {
}
