package com.kitaplik.library_service.service;

import com.kitaplik.library_service.client.BookServiceClient;
import com.kitaplik.library_service.dto.*;
import com.kitaplik.library_service.exception.LibraryNotFoundExpection;
import com.kitaplik.library_service.model.Library;
import com.kitaplik.library_service.model.LibraryItem;
import com.kitaplik.library_service.model.ReadStatus;
import com.kitaplik.library_service.repository.LibraryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final BookServiceClient bookServiceClient;

    public LibraryService(LibraryRepository libraryRepository, BookServiceClient bookServiceClient) {
        this.libraryRepository = libraryRepository;
        this.bookServiceClient = bookServiceClient;
    }

    public LibraryDto getAllBooksInLibraryId(String id) {
        Library library = libraryRepository.findById(id)
                .orElseThrow(() -> new LibraryNotFoundExpection("Library could not found by id: " + id));

        List<LibraryItemDto> itemDtos = library.getUserBook()
                .stream()
                .map(item -> {
                    BookDto bookDto = bookServiceClient.getBookById(item.getBookId()).getBody();
                    return new LibraryItemDto(
                            item.getId(),
                            bookDto,
                            item.getReadStatus(),
                            item.getCurrentPage(),
                            item.getTotalPages(),
                            item.getRating(),
                            item.getReview()
                    );
                })
                .collect(Collectors.toList());

        return new LibraryDto(library.getId(), itemDtos);
    }

    public LibraryDto createLibrary() {
        Library newLibrary = libraryRepository.save(new Library());
        return new LibraryDto(newLibrary.getId(), new ArrayList<>());
    }

    public void addBookToLibrary(AddBookRequest request) {
        BookIdDto bookIdDto = bookServiceClient.getBookByIsbn(request.getIsbn()).getBody();
        String bookId = bookIdDto.getBookId();

        Library library = libraryRepository.findById(request.getId())
                .orElseThrow(() -> new LibraryNotFoundExpection("Library could not found by id: " + request.getId()));

        // 🔍 Backend Seviyesi Mükerrer Kitap Kontrolü
        boolean alreadyExists = library.getUserBook().stream()
                .anyMatch(item -> item.getBookId().equals(bookId));

        if (alreadyExists) {
            throw new RuntimeException("Bu kitap zaten kütüphanenizde mevcut!");
        }

        // Book-Service'ten sayfa sayısını öğrenelim
        BookDto bookDto = bookServiceClient.getBookById(bookId).getBody();
        int totalPages = (bookDto != null) ? bookDto.getTotalPages() : 0;

        LibraryItem newItem = new LibraryItem(null, bookId, ReadStatus.NOT_STARTED, 0, totalPages, null, null);
        library.getUserBook().add(newItem);

        libraryRepository.save(library);
    }


    // 1. Okuma İlerlemesini Güncelleme (Sayfa ve Otomatik Statü Değişimi)
    public LibraryDto updateReadingProgress(String libraryId, String itemId, UpdateProgressRequest request) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new LibraryNotFoundExpection("Library could not found by id: " + libraryId));

        LibraryItem targetItem = library.getUserBook().stream()
                .filter(item -> item.getId() != null && item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Library item not found: " + itemId));

        if (request.getCurrentPage() != null) {
            targetItem.setCurrentPage(request.getCurrentPage());

            // Otomatik Statü Yönetimi
            if (targetItem.getCurrentPage() > 0 && targetItem.getReadStatus() == ReadStatus.NOT_STARTED) {
                targetItem.setReadStatus(ReadStatus.READING);
            }
            if (targetItem.getTotalPages() > 0 && targetItem.getCurrentPage() >= targetItem.getTotalPages()) {
                targetItem.setCurrentPage(targetItem.getTotalPages());
                targetItem.setReadStatus(ReadStatus.COMPLETED);
            }
        }

        if (request.getReadStatus() != null) {
            targetItem.setReadStatus(request.getReadStatus());
        }

        if (request.getRating() != null) {
            targetItem.setRating(request.getRating());
        }

        if (request.getReview() != null) {
            targetItem.setReview(request.getReview());
        }

        libraryRepository.save(library);
        return getAllBooksInLibraryId(libraryId);
    }

    public List<String> getAllLibraries() {
        return libraryRepository.findAll()
                .stream()
                .map(Library::getId)
                .collect(Collectors.toList());
    }
}