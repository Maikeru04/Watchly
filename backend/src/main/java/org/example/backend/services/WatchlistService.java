package org.example.backend.services;

import org.example.backend.dtos.WatchlistInDto;
import org.example.backend.exceptions.WatchlistNotFoundException;
import org.example.backend.models.Item;
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

    public Watchlist getWatchlistById(String id, String userId) {
        Watchlist watchlist = repo.findById(id)
                .orElseThrow(() -> new WatchlistNotFoundException(id));

        if (!watchlist.userId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        return watchlist;
    }

    public List<Watchlist> getWatchlistsByUser(String userId) {
        return repo.findByUserId(userId);
    }

    public Watchlist createWatchlist(WatchlistInDto watchlistDto, String userId) {
        Watchlist watchlist = new Watchlist(generateUUID(), userId, watchlistDto.name(), watchlistDto.description(), new ArrayList<>(), watchlistDto.type());
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

    public Watchlist addMovieToWatchlist(String watchlistID, Item movieID, String userID) {
        if(!repo.existsById(watchlistID)) {
            throw new WatchlistNotFoundException(watchlistID);
        }
        Watchlist watchlist = getWatchlistById(watchlistID, userID);

        List<Item> updated = new ArrayList<>(watchlist.items());
        updated.add(movieID);

        return repo.save(watchlist.withItems(updated));
    }

    public boolean deleteMovieFromWatchlist(String watchlistID, Item movieID, String userID) {
        if(!repo.existsById(watchlistID)) {
            throw new WatchlistNotFoundException(watchlistID);
        }
        Watchlist watchlist = getWatchlistById(watchlistID, userID);
        List<Item> updatedItems = new ArrayList<>(watchlist.items());
        updatedItems.remove(movieID);

        repo.save(watchlist.withItems(updatedItems));

        if(!repo.existsById("Completed") && movieID.rating() > 0) {
            repo.save(new Watchlist("Completed", userID, "Completed", "Movies you already completed will land here!", new ArrayList<Item>(), "Completed"));
        }
        Watchlist completed = getWatchlistById("Completed", userID);
        if(movieID.rating() > 0) {
            List<Item> updatedCompletedItems = new ArrayList<>(completed.items());
            updatedCompletedItems.add(movieID);
            repo.save(completed.withItems(updatedCompletedItems));
        }

        if(watchlistID.equals(completed.id())) {
            List<Item> updatedCompletedItems = new ArrayList<>(completed.items());
            updatedCompletedItems.remove(movieID);
            repo.save(completed.withItems(updatedCompletedItems));
        }
        return true;
    }

    public Item getMovieFromWatchlist(String watchlistID, String movieID, String userID) {
        if(!repo.existsById(watchlistID)) {
            throw new WatchlistNotFoundException(watchlistID);
        }

        Watchlist watchlist = getWatchlistById(watchlistID, userID);

        for(Item item : watchlist.items()) {
            if(item.itemID().equals(movieID)) {
                return item;
            }
        }
        return null;
    }

    public boolean changeMovieRating(String watchlistID, String movieID, double newRating, String userID) {
        if(!repo.existsById(watchlistID)) {
            throw new WatchlistNotFoundException(watchlistID);
        }

        Watchlist watchlist = getWatchlistById(watchlistID, userID);

        List<Item> updatedItems = watchlist.items().stream()
                .map(item -> {
                    if (item.itemID().equals(movieID)) {
                        return item.withRating(newRating);
                    }
                    return item;
                })
                .toList();

        Watchlist updatedWatchlist = watchlist.withItems(updatedItems);

        repo.save(updatedWatchlist);

        return true;
    }
}
