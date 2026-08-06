package com.kitaplik.user_service.dto

data class CreateUserRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String
)