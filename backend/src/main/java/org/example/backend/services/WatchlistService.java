package org.example.backend.services;

import org.example.backend.dtos.WatchlistInDto;
import org.example.backend.models.Watchlist;
import org.example.backend.repositories.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {
    private final WatchlistRepository repo;

    public WatchlistService(WatchlistRepository repo) {
        this.repo = repo;
    }

    public List<Watchlist> getAllWatchlists() {
        return null;
    }


    public Watchlist getWatchlistById(String id) {
        return null;
    }


    public WatchlistInDto createWatchlist(WatchlistInDto watchlist) {
        return null;
    }


    public Watchlist updateWatchlist(String id) {
        return null;
    }


    public boolean deleteWatchlist(String id) {
        return true;
    }
}
