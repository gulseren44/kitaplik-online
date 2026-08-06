package com.kitaplik.library_service.model

import jakarta.persistence.*

@Entity
data class Library @JvmOverloads constructor(
    @Id
    @Column(name = "library_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JoinColumn(name = "library_id")
    val userBook: List<LibraryItem> = ArrayList()
)