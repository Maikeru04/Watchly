package org.example.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.NoSuchElementException;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WatchlistNotFoundException extends NoSuchElementException {

    public WatchlistNotFoundException(String id) {
        super("Watchlist mit ID " + id + " nicht gefunden");
    }
}
