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
        return repo.findById(id).orElseThrow(() -> new WatchlistNotFoundException(id));
    }


    public Watchlist createWatchlist(WatchlistInDto watchlistDto) {
        Watchlist watchlist = new Watchlist(generateUUID(), watchlistDto.name(), watchlistDto.description(), new ArrayList<>(), watchlistDto.type());
        return repo.save(watchlist);
    }


    public Watchlist updateWatchlistById(String id, WatchlistInDto newWatchlist) {
        Watchlist watchlist = repo.findById(id).orElseThrow(() -> new WatchlistNotFoundException(id));
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


    public boolean deleteWatchlistById(String id) {
        if(!repo.existsById(id)) {
            throw new WatchlistNotFoundException(id);
        }
        repo.deleteById(id);
        return true;
    }

    // MOVIE SECTION

    public Watchlist addMovieToWatchlist(String watchlistID, String movieID) {
        Watchlist watchlist = repo.findById(watchlistID).orElseThrow(() -> new WatchlistNotFoundException(watchlistID));

        List<String> updated = new ArrayList<>(watchlist.itemIDs());
        updated.add(movieID);

        return repo.save(watchlist.withItemIDs(updated));
    }

    public boolean deleteMovieFromWatchlist(String watchlistID, String movieID) {
        if(!repo.existsById(watchlistID)) {
            throw new WatchlistNotFoundException(watchlistID);
        }
        Watchlist watchlist = getWatchlistById(watchlistID);

        List<String> updatedItems = new ArrayList<>(watchlist.itemIDs());
        updatedItems.remove(movieID);

        repo.save(watchlist.withItemIDs(updatedItems));
        return true;
    }
}
