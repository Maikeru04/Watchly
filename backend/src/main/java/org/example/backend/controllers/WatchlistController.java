package org.example.backend.controllers;

import org.example.backend.dtos.WatchlistInDto;
import org.example.backend.models.Watchlist;
import org.example.backend.services.WatchlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService service;


    public WatchlistController(WatchlistService service) {
        this.service = service;
    }

    @GetMapping
    public List<Watchlist> getAllWatchlists() {
        return service.getAllWatchlists();
    }

    @GetMapping("/{id}")
    public Watchlist getWatchlistById(@PathVariable String id) {
        return service.getWatchlistById(id);
    }

    @PostMapping
    public WatchlistInDto createWatchlist(@RequestBody WatchlistInDto watchlist) {
        return service.createWatchlist(watchlist);
    }

    @PutMapping("/{id}")
    public Watchlist updateWatchlist(@PathVariable String id) {
        return service.updateWatchlist(id);
    }

    @DeleteMapping("/{id}")
    public boolean deleteWatchlist(@PathVariable String id) {
        return service.deleteWatchlist(id);
    }
}
