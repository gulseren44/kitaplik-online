package com.kitaplik.library_service.dto

import com.kitaplik.library_service.model.ReadStatus

data class LibraryItemDto @JvmOverloads constructor(
    val id: String? = null,
    val book: BookDto? = null,
    val readStatus: ReadStatus = ReadStatus.NOT_STARTED,
    val currentPage: Int = 0,
    val totalPages: Int = 0,
    val rating: Int? = null,
    val review: String? = null
) {
    // Okuma Yüzdesini Hesaplayan Dinamik Alan (%)
    val progressPercentage: Int
        get() = if (totalPages > 0) ((currentPage.toDouble() / totalPages) * 100).toInt() else 0
}