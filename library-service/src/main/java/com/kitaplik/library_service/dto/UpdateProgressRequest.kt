package com.kitaplik.library_service.dto

import com.kitaplik.library_service.model.ReadStatus

data class UpdateProgressRequest(
    val currentPage: Int? = null,
    val readStatus: ReadStatus? = null,
    val rating: Int? = null,
    val review: String? = null
)