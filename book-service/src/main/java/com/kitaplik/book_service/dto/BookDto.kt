package com.kitaplik.book_service.dto

import com.kitaplik.book_service.model.Book

//@JvmOverloads : sınıfa ait birden fazla constructor sunuyor
// yani null alanlarım için tekrardan constructor lar yaratıyor
data class BookDto @JvmOverloads constructor(
    val id: BookIdDto? = null,
    val title: String,
    val bookYear: Int,
    val author: String,
    val pressName: String,
    val totalPages: Int = 0
){
    companion object {
        @JvmStatic
        fun convert(from: Book): BookDto {
            return BookDto(
                from.id?.let { BookIdDto.convert(it, from.isbn) },
                from.title,
                from.bookYear,
                from.author,
                from.pressName,
                from.totalPages
            )
        }

    }
}