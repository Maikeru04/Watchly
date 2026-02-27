package org.example.backend.controllers;

import org.example.backend.models.Item;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.example.backend.dtos.WatchlistInDto;
import org.example.backend.models.Watchlist;
import org.example.backend.services.WatchlistService;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService service;


    public WatchlistController(WatchlistService service) {
        this.service = service;
    }

    @GetMapping("/user")
    public List<Watchlist> getAllWatchlistsByUser(@AuthenticationPrincipal OAuth2User user) {
        return service.getWatchlistsByUser(user.getName());
    }

    @GetMapping("/{id}")
    public Watchlist getWatchlistById(@PathVariable String id, @AuthenticationPrincipal OAuth2User user) {
        return service.getWatchlistById(id, user.getName());
    }

    @PostMapping
    public Watchlist createWatchlist(@RequestBody WatchlistInDto watchlist, @AuthenticationPrincipal OAuth2User user) {
        return service.createWatchlist(watchlist, user.getName());
    }

    @PutMapping("/{id}")
    public Watchlist updateWatchlist(@PathVariable String id, @RequestBody WatchlistInDto watchlist) {
        return service.updateWatchlistById(id, watchlist);
    }

    @DeleteMapping("/{id}")
    public boolean deleteWatchlist(@PathVariable String id) {
        return service.deleteWatchlistById(id);
    }

    @PostMapping("/{watchlistID}/movie")
    public Watchlist addMovieToWatchlist(@PathVariable String watchlistID, @RequestBody Item movieID, @AuthenticationPrincipal OAuth2User user) {
        return service.addMovieToWatchlist(watchlistID, movieID, user.getName());
    }

    @DeleteMapping("/{watchlistID}/movie")
    public boolean deleteMovieFromWatchlist(@PathVariable String watchlistID, @RequestBody Item movieID, @AuthenticationPrincipal OAuth2User user) {
        return service.deleteMovieFromWatchlist(watchlistID, movieID, user.getName());
    }
}
