package com.kitaplik.user_service.dto

data class UserDto @JvmOverloads constructor(
    val id: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val libraryId: String
)