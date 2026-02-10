package org.example.backend.repositories;

import org.example.backend.models.Watchlist;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WatchlistRepository extends MongoRepository<Watchlist, String> {
}
