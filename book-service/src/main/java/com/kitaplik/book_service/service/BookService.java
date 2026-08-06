package com.kitaplik.book_service.service;

import com.kitaplik.book_service.dto.BookDto;
import com.kitaplik.book_service.dto.BookIdDto;
import com.kitaplik.book_service.exception.BookNotFoundException;
import com.kitaplik.book_service.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {
    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }
    //tüm kitapları getirecek endpoint
    public List<BookDto> getAllBooks(){
        return repository.findAll()
                .stream()
                .map(BookDto::convert)
                .collect(Collectors.toList());
    }

    //ısbn le sorgu yapmamı ve veri tabanında ısbn ne karşılık gelen kitabı getirecek
    public BookIdDto findByIsbn(String isbn) {
        return repository.getBookByIsbn(isbn)
                .map(book -> new BookIdDto(book.getId(), book.getIsbn()))
                .orElseThrow(() -> new BookNotFoundException("Book could not found by isbn: " + isbn));
    }


    public BookDto findBookDetailsById(String id) {
        return repository.findById(id)
                .map(BookDto::convert)
                .orElseThrow(() -> new BookNotFoundException("Book could not found by id: " + id));
    }

}
