package org.example.backend.repositories;

import org.example.backend.models.Watchlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchlistRepository extends MongoRepository<Watchlist, String> {
    List<Watchlist> findByUserId(String userId);
}
