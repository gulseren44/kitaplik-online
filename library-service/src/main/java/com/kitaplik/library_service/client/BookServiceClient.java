package com.kitaplik.library_service.client;

import com.kitaplik.library_service.dto.BookDto;
import com.kitaplik.library_service.dto.BookIdDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.slf4j.Logger;


@FeignClient(value = "book-service",path = "/v1/book")
//server bilgilerini cekip hangi path de calisacagini belirleyip kullanima aciyoruz
public interface BookServiceClient {

    Logger logger = LoggerFactory.getLogger(BookServiceClient.class);

    @GetMapping("/isbn/{isbn}")
    @CircuitBreaker(name= "getBookByIsbnCircuitBreaker" , fallbackMethod = "getBookFallback")
    ResponseEntity<BookIdDto> getBookByIsbn(@PathVariable(value = "isbn") String isbn);

    default ResponseEntity<BookIdDto> getBookFallback(String isbn, Exception exception){
        logger.info("Book not found by isbn" + isbn + ", returning default BookDto object");
        return ResponseEntity.ok(new BookIdDto("default-book" , "default-isbn"));
    }

    @GetMapping("/book/{bookId}")
    @CircuitBreaker(name= "getBookByIdCircuitBreaker", fallbackMethod = "getBookByIdFallback")
    ResponseEntity<BookDto> getBookById(@PathVariable(value = "bookId") String bookId);

    default ResponseEntity<BookDto> getBookByIdFallback(String bookId, Exception exception){
        logger.info("Book not found by bookId" + bookId + ", returning default BookDto object");
        // totalPages için varsayılan olarak 0 eklendi
        return ResponseEntity.ok(new BookDto(new BookIdDto("default-book" , "isbn"), "Default Book", 0, "Default Author", "Default Press", 0));
    }

}
