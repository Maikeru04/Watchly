package org.example.backend.services;

import org.example.backend.dtos.WatchlistInDto;
import org.example.backend.exceptions.WatchlistNotFoundException;
import org.example.backend.models.Watchlist;
import org.example.backend.repositories.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class WatchlistService {
    private final WatchlistRepository repo;

    public WatchlistService(WatchlistRepository repo) {
        this.repo = repo;
    }

    public String generateUUID() {
        return UUID.randomUUID().toString();
    }

    public List<Watchlist> getAllWatchlists() {
        return repo.findAll();
    }


    public Watchlist getWatchlistById(String id) {
        if(!repo.existsById(id)) {
            throw new WatchlistNotFoundException(id);
        }
        return repo.findById(id).get();
    }


    public Watchlist createWatchlist(WatchlistInDto watchlistDto) {
        Watchlist watchlist = new Watchlist(generateUUID(), watchlistDto.name(), watchlistDto.description(), new ArrayList<>());
        return repo.save(watchlist);
    }


    public Watchlist updateWatchlist(String id, WatchlistInDto newWatchlist) {
        if(!repo.existsById(id)) {
            throw new WatchlistNotFoundException(id);
        }
        Watchlist watchlist = repo.findById(id).get();
        String tempName = watchlist.name();
        String tempDescription = watchlist.description();

        if(newWatchlist.name() != null && !newWatchlist.name().equals(tempName)) {
            tempName = newWatchlist.name();
        }

        if(newWatchlist.description() != null && !newWatchlist.description().equals(tempDescription)) {
            tempDescription = newWatchlist.description();
        }

        return repo.save(watchlist
                .withName(tempName)
                .withDescription(tempDescription));
    }


    public boolean deleteWatchlist(String id) {
        if(!repo.existsById(id)) {
            throw new WatchlistNotFoundException(id);
        }
        repo.deleteById(id);
        return true;
    }
}
