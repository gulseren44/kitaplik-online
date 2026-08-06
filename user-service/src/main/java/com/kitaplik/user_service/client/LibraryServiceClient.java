package com.kitaplik.user_service.client;

import com.kitaplik.user_service.dto.LibraryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "library-service", path = "/v1/library")
public interface LibraryServiceClient {

    @PostMapping
    ResponseEntity<LibraryDto> createLibrary();
}