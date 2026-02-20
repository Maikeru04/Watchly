package org.example.backend.models;

import lombok.Builder;

@Builder
public record AppUser(String id, String username) {
}
