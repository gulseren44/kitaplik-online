package com.kitaplik.library_service.model

import jakarta.persistence.*

@Entity
@Table(name = "library_items")
data class LibraryItem @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    val bookId: String,

    @Enumerated(EnumType.STRING)
    var readStatus: ReadStatus = ReadStatus.NOT_STARTED,

    var currentPage: Int = 0,
    var totalPages: Int = 0,
    var rating: Int? = null, // 1-5 arası puan

    @Column(length = 1000)
    var review: String? = null // Kişisel not veya yorum
)