package com.kitaplik.book_service.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Table
import jakarta.persistence.Id

@Entity
@Table(name = "books")
data class Book @JvmOverloads constructor(
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)

  val id: String? = null,
  val title: String,
  val bookYear: Int,
  val author: String,
  val pressName: String,
  val isbn: String,
  val totalPages: Int
)
