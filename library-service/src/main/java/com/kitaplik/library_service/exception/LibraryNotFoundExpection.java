package com.kitaplik.library_service.exception;

public class LibraryNotFoundExpection extends RuntimeException {
    public LibraryNotFoundExpection(String message) {
        super(message);
    }
}
