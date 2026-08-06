package com.kitaplik.user_service.service;

import com.kitaplik.user_service.client.LibraryServiceClient;
import com.kitaplik.user_service.dto.CreateUserRequest;
import com.kitaplik.user_service.dto.LibraryDto;
import com.kitaplik.user_service.dto.UserDto;
import com.kitaplik.user_service.model.User;
import com.kitaplik.user_service.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LibraryServiceClient libraryServiceClient;

    public UserService(UserRepository userRepository, LibraryServiceClient libraryServiceClient) {
        this.userRepository = userRepository;
        this.libraryServiceClient = libraryServiceClient;
    }

    public UserDto createUser(CreateUserRequest request) {
        // 1. E-posta kontrolü (Aynı mail daha önce kaydedilmiş mi?)
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanımda!");
        }

        // 2. Kütüphane profilini oluştur
        LibraryDto libraryDto = libraryServiceClient.createLibrary().getBody();
        String libraryId = (libraryDto != null) ? libraryDto.getId() : "";

        // 3. Yeni kullanıcıyı hazırla ve kaydet
        User user = new User(
                null,
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                libraryId
        );

        User savedUser = userRepository.save(user);

        return new UserDto(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getLibraryId()
        );
    }

    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getLibraryId()
        );
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getLibraryId()
        );
    }
}