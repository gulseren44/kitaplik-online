import React, { useState, useEffect } from 'react';
import { Home, Bookmark, FileText, Search, BookmarkCheck, LogOut, User, Loader2, BookOpen, Star, MessageSquare } from 'lucide-react';
import axios from 'axios';

const bookCoversMap = {
  // --- FANTASTİK & EDİBİYAT ---
  "Dünyanın Gözü": "https://img.kitapyurdu.com/v1/getImage/fn:11253111/wh:b14c24a12/miw:200/mih:200",
  "Yüzüklerin Efendisi": "https://covers.openlibrary.org/b/isbn/9789753423472-L.jpg",
  "Harry Potter ve Felsefe Taşı": "https://covers.openlibrary.org/b/isbn/9789750802942-L.jpg",
  "Kralların Yolu": "https://m.media-amazon.com/images/I/71Blg3H6roL.jpg",
  "Rüzgarın Adı": "https://img.kitapyurdu.com/v1/getImage/fn:9841842/wi:800/wh:33322be36",
  "Hobbit": "https://m.media-amazon.com/images/I/71ZkF8MQVcL._AC_UF1000,1000_QL80_.jpg",
  "Tutunamayanlar": "https://upload.wikimedia.org/wikipedia/tr/a/a2/Tutunamayanlar-kapak.jpg",
  "Şeker Portakalı": "https://img.kitapyurdu.com/v1/getImage/fn:11462950/wi:800/wh:b162d5f38",
  "Kürk Mantolu Madonna": "https://img.kitapyurdu.com/v1/getImage/fn:1207631/wi:800/wh:1a63c8d49",
  "Simyacı": "https://img.kitapyurdu.com/v1/getImage/fn:11819904/wi:800/wh:71b90a47a",
  "Küçük Prens": "https://upload.wikimedia.org/wikipedia/tr/thumb/f/f5/Kucukprens.jpg/960px-Kucukprens.jpg",
  "Saatleri Ayarlama Enstitüsü": "https://upload.wikimedia.org/wikipedia/tr/5/52/Saatleri_Ayarlama_Enstit%C3%BCs%C3%BC.jpg",

  // --- BİLİM KURGU ---
  "Dune": "https://wwwithakiyayingrubucom.sm.mncdn.com/wwwithakiyayingrubucom-pictures/bbf6ad11-c5d7-4970-ac19-ba45f34d96e2_dunebutleryan-chadi_800.webp",
  "1984": "https://covers.openlibrary.org/b/isbn/9789750718533-L.jpg",
  "Cesur Yeni Dünya": "https://img.kitapyurdu.com/v1/getImage/fn:11643404/wi:800/wh:5566872ea",
  "Vakıf": "https://upload.wikimedia.org/wikipedia/tr/0/05/Vak%C4%B1f_kapak.jpg",
  "Fahrenheit 451": "https://img.kitapyurdu.com/v1/getImage/fn:11643403/wi:800/wh:e04f56c36",
  "Ototopçunun Galaksi Rehberi": "https://img.kitapyurdu.com/v1/getImage/fn:12239799/wi:500/wh:0e562a8b5",

  // --- KLASİKLER ---
  "Suç ve Ceza": "https://i.dr.com.tr/cache/600x600-0/originals/0000000222779-1.jpg",
  "Gurur ve Önyargı": "https://img.iskultur.com.tr/webp/2006/04/gurur-ve-onyargi-3.jpg",
  "Sefiller": "https://oopbook.com/wp-content/uploads/2023/08/Sefil.webp",
  "Dönüşüm": "https://img.kitapyurdu.com/v1/getImage/fn:1007563/wi:500/wh:8df410540",
  "İki Şehrin Hikayesi": "https://i.dr.com.tr/cache/600x600-0/originals/0001788068001-1.jpg",
  "Karamazov Kardeşler": "https://img.kitapyurdu.com/v1/getImage/fn:2152305/wi:500/wh:248a07d72",

  // --- TARİH ---
  "Sapiens: İnsan Türünün Kısa Bir Tarihi": "https://cdn.dsmcdn.com/mnresize/420/620/ty1018/product/media/images/prod/SPM/PIM/20231018/16/e35cf2de-26ce-323e-aa4d-9c0aa2a224c6/1_org_zoom.jpg",
  "Tüfek, Mikrop ve Çelik": "https://img.kitapyurdu.com/v1/getImage/fn:7027950/wi:800/wh:63667e134",
  "İlber Ortaylı ile Yakın Tarihin Gerçekleri": "https://img.kitapyurdu.com/v1/getImage/fn:11388888/wh:a057cad7e/miw:200/mih:200",
  "Devlet": "https://img.kitapyurdu.com/v1/getImage/fn:115805/wi:500/wh:d722df406",
  "Ortadoğu Tarihi": "https://img.kitapyurdu.com/v1/getImage/fn:11535224/wi:500/wh:28f16b4f6",
  "Osmanlı İmparatorluğu Klasik Çağ": "https://img.kitapyurdu.com/v1/getImage/fn:8634554/wi:500/wh:2653942df"
};

const getCoverUrl = (book) => {
  if (book.title && bookCoversMap[book.title]) {
    return bookCoversMap[book.title];
  }
  if (book.cover && book.cover.trim() !== "" && !book.cover.includes("unsplash")) {
    return book.cover;
  }
  return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";
};

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  ISBN Arama State'i
  const [searchIsbn, setSearchIsbn] = useState('');

  //  Kullanıcının Kütüphanesi ve Yüklenme State'leri
  const [myLibrary, setMyLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  // Kütüphane İç Sekmeleri ('all', 'reading', 'finished', 'onHold')
  const [librarySubTab, setLibrarySubTab] = useState('all');

  // Hangi kitabın ilerlemesi güncelleniyor (ID'si tutulur)
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [inputPage, setInputPage] = useState('');

  // Aktif Seçili Kategori State'i ("Tümü" varsayılan)
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ["Tümü", "Fantastik", "Edebiyat", "Bilim Kurgu", "Klasikler", "Tarih"];

  //  Notlar ve Yorumlar State'leri
  const [bookNotes, setBookNotes] = useState({}); // { [itemId]: { rating: 5, note: "Harikaydı..." } }
  const [selectedBookForNote, setSelectedBookForNote] = useState('');
  const [currentRating, setCurrentRating] = useState(5);
  const [currentNoteText, setCurrentNoteText] = useState('');

  // Fallback Kitaplar
  const fallbackBooks = [
    { bookId: "1", title: "Dünyanın Gözü", bookYear: 2000, author: "Robert Jordan", pressName: "İthaki Yayınevi", isbn: "1001", totalPages: 800 },
    { bookId: "2", title: "Yüzüklerin Efendisi", bookYear: 1954, author: "J.R.R. Tolkien", pressName: "Metis Yayıncılık", isbn: "1002", totalPages: 1026 },
    { bookId: "3", title: "Tutunamayanlar", bookYear: 1972, author: "Oğuz Atay", pressName: "İletişim Yayınları", isbn: "2001", totalPages: 724 },
    { bookId: "4", title: "Dune", bookYear: 1965, author: "Frank Herbert", pressName: "İthaki Yayınevi", isbn: "3001", totalPages: 712 },
    { bookId: "5", title: "Suç ve Ceza", bookYear: 1866, author: "Fyodor Dostoyevski", pressName: "İş Bankası Yayınları", isbn: "4001", totalPages: 687 },
    { bookId: "6", title: "Sapiens", bookYear: 2011, author: "Yuval Noah Harari", pressName: "Kolektif Kitap", isbn: "5001", totalPages: 412 }
  ];

  //  book-service Backend API Çağrısı
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8888/v1/book');

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setBooks(response.data);
        } else {
          setBooks(fallbackBooks);
        }
      } catch (err) {
        console.warn("book-service bağlantı hatası, fallback veriler yükleniyor:", err);
        setError("Backend verileri çekilemedi, varsayılan liste yükleniyor.");
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  //  Kütüphane ID'sini Alma veya Oluşturma
  const getOrCreateLibraryId = async () => {
    let libId = localStorage.getItem("userLibraryId");
    if (!libId) {
      try {
        const response = await axios.post('http://localhost:8888/v1/library');
        libId = response.data?.id || response.data?.libraryId;
        if (libId) {
          localStorage.setItem("userLibraryId", libId);
        }
      } catch (err) {
        console.error("Kütüphane oluşturulamadı:", err);
      }
    }
    return libId;
  };

  //  Kütüphanedeki Kitapları Çekme
  const fetchMyLibrary = async () => {
    try {
      setLibraryLoading(true);
      const libraryId = await getOrCreateLibraryId();
      if (!libraryId) return;

      const response = await axios.get(`http://localhost:8888/v1/library/${libraryId}`);
      if (response.data) {
        const booksList = response.data.userBookList || response.data.bookList || response.data.books || [];
        setMyLibrary(booksList);
      }
    } catch (err) {
      console.warn("Kütüphane verileri çekilemedi:", err);
    } finally {
      setLibraryLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLibrary();
  }, []);

  //  Kütüphaneye Kitap Ekleme (Duplicate / Mükerrer Kontrollü)
  const handleAddToLibrary = async (book) => {
    try {
      const bookIsbn = book.isbn || book.id?.isbn || "";

      const alreadyExists = myLibrary.some(item =>
        (item.book?.isbn === bookIsbn) || (item.isbn === bookIsbn) || (item.book?.title === book.title)
      );

      if (alreadyExists) {
        alert(`"${book.title}" zaten kütüphanende mevcut! `);
        return;
      }

      const libraryId = await getOrCreateLibraryId();
      if (!libraryId) {
        alert("Kütüphane ID alınamadı!");
        return;
      }

      await axios.put(`http://localhost:8888/v1/library`, {
        id: libraryId,
        isbn: bookIsbn
      });

      alert(`"${book.title}" kütüphanene başarıyla eklendi! `);
      fetchMyLibrary();
    } catch (err) {
      console.error("Kütüphaneye ekleme hatası:", err);
      alert("Kitap kütüphaneye eklenirken bir hata oluştu.");
    }
  };

  // Okuma İlerlemesini Güncelleme
  const handleUpdateProgress = async (itemId, totalPages) => {
    const pageNum = parseInt(inputPage);
    if (isNaN(pageNum) || pageNum < 0) {
      alert("Lütfen geçerli bir sayfa sayısı girin!");
      return;
    }

    if (pageNum > totalPages) {
      alert(`Girilen sayfa sayısı kitabın toplam sayfasından (${totalPages}) büyük olamaz!`);
      return;
    }

    try {
      const libraryId = await getOrCreateLibraryId();
      if (!libraryId) return;

      let newStatus = "NOT_STARTED";
      if (pageNum > 0 && pageNum < totalPages) {
        newStatus = "READING";
      } else if (pageNum >= totalPages) {
        newStatus = "COMPLETED";
      }

      await axios.put(`http://localhost:8888/v1/library/${libraryId}/item/${itemId}/progress`, {
        currentPage: pageNum,
        readStatus: newStatus
      });

      alert("Okuma ilerlemen başarıyla güncellendi! ");
      setUpdatingItemId(null);
      setInputPage('');
      fetchMyLibrary();
    } catch (err) {
      console.error("İlerleme güncellenemedi:", err);
      alert("İlerleme güncellenirken bir hata oluştu.");
    }
  };

  //  Kitap Notu / Yorumu Kaydetme
  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!selectedBookForNote) {
      alert("Lütfen bir kitap seçin!");
      return;
    }
    if (!currentNoteText.trim()) {
      alert("Lütfen bir not veya yorum yazın!");
      return;
    }

    setBookNotes(prev => ({
      ...prev,
      [selectedBookForNote]: {
        rating: currentRating,
        note: currentNoteText,
        date: new Date().toLocaleDateString('tr-TR')
      }
    }));

    alert("Notun ve puanın başarıyla kaydedildi!");
    setSelectedBookForNote('');
    setCurrentNoteText('');
    setCurrentRating(5);
  };

  useEffect(() => {
    if (activeTab === 'library' || activeTab === 'notes') {
      fetchMyLibrary();
    }
  }, [activeTab]);

  // ISBN Koduna Göre Kategori
  const getCategoryByBook = (book) => {
    const isbnVal = book?.isbn || book?.id?.isbn;
    if (!isbnVal) return "Diğer";
    const isbnStr = String(isbnVal).trim();
    if (isbnStr.startsWith("1")) return "Fantastik";
    if (isbnStr.startsWith("2")) return "Edebiyat";
    if (isbnStr.startsWith("3")) return "Bilim Kurgu";
    if (isbnStr.startsWith("4")) return "Klasikler";
    if (isbnStr.startsWith("5")) return "Tarih";
    return "Diğer";
  };

  // Kategori ve ISBN Filtreleme
  const filteredBooks = books.filter(book => {
    const bookIsbn = String(book?.isbn || book?.id?.isbn || "").trim();
    const categoryName = getCategoryByBook(book);

    const matchesCategory = selectedCategory === "Tümü" || categoryName === selectedCategory;
    const matchesIsbn = searchIsbn.trim() === "" || bookIsbn.includes(searchIsbn.trim());

    return matchesCategory && matchesIsbn;
  });

  // Kütüphane Alt Sekme Filtreleme
  const getFilteredLibraryBooks = () => {
    return myLibrary.filter(item => {
      const current = item.currentPage || 0;
      const total = item.totalPages || item.book?.totalPages || 300;
      const status = item.readStatus;

      if (librarySubTab === 'reading') {
        return (current > 0 && current < total) || status === 'READING';
      }
      if (librarySubTab === 'finished') {
        return current >= total || status === 'COMPLETED' || status === 'FINISHED';
      }
      if (librarySubTab === 'onHold') {
        return current === 0 || status === 'NOT_STARTED';
      }
      return true;
    });
  };

  const displayedLibraryBooks = getFilteredLibraryBooks();

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans">

      {/* 1. SOL SIDEBAR */}
      <aside className="w-64 border-r border-gray-200/60 p-8 flex flex-col justify-between bg-white/50 backdrop-blur-sm fixed h-full z-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-serif text-[#1A2B48] tracking-wider font-bold">
              AYRAÇ
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
              Digital Library
            </p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-[#1A2B48] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <Home size={18} />
              <span>Ana Sayfa</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'library'
                  ? 'bg-[#1A2B48] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <Bookmark size={18} />
              <span>Kütüphanem</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'notes'
                  ? 'bg-[#1A2B48] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <FileText size={18} />
              <span>Notlarım</span>
            </button>
          </nav>
        </div>

        <div className="text-[10px] text-gray-400">
          © 2026 Ayraç Inc.
        </div>
      </aside>

      {/* 2. ANA İÇERİK ALANI */}
      <main className="flex-1 ml-64 p-10 space-y-10 max-w-7xl">

        {/* Üst Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="ISBN numarasına göre ara (Örn: 1001)..."
              value={searchIsbn}
              onChange={(e) => setSearchIsbn(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F0F1F5]/60 text-sm rounded-full outline-none focus:ring-2 focus:ring-[#1A2B48] transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-700">
              <BookmarkCheck size={20} />
            </button>

            <div className="h-6 w-[1px] bg-gray-200"></div>

            <div className="flex items-center space-x-3 bg-white px-3.5 py-1.5 rounded-full border border-gray-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#1A2B48] text-white flex items-center justify-center font-serif text-xs font-semibold shrink-0">
                {user?.firstName ? user.firstName[0].toUpperCase() : <User size={14} />}
              </div>

              <div className="text-left">
                <p className="text-xs font-semibold text-[#1A2B48] leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Julian Barnes'}
                </p>
              </div>

              <button
                onClick={onLogout}
                title="Çıkış Yap"
                className="p-1 text-gray-400 hover:text-rose-600 rounded-lg transition-colors ml-1"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* HOME SEKME İÇERİĞİ */}
        {activeTab === 'home' && (
          <>
            <div className="bg-[#EAE4D9] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif text-[#1A2B48] font-bold leading-tight">
                  Yüzüklerin Efendisi
                </h2>
                <p className="text-sm text-[#1A2B48]/80 leading-relaxed font-light">
                  J.R.R Tolkien tarafından yazılan, Metis Yayıncılık basımı 1026 sayfalık devasa epik fantezi şaheseri.
                </p>
              </div>

              <div className="relative w-56 h-80 rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop"
                  alt="Yüzüklerin Efendisi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* KATEGORİ BUTONLARI */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-[#1A2B48]">Kategoriler</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={`category-btn-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#1A2B48] text-white shadow-sm scale-105'
                        : 'bg-[#F0F1F5]/80 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* KİTAP KARTLARI LİSTESİ */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1A2B48]">
                    {selectedCategory === "Tümü" ? "Kütüphanedeki Kitaplar" : `${selectedCategory} Kitapları`}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {filteredBooks.length} adet kitap gösteriliyor {searchIsbn && `(ISBN: "${searchIsbn}" araması)`}
                  </p>
                </div>
                {error && <span className="text-[11px] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">{error}</span>}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400 space-x-2">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-sm font-medium">H2 veritabanından kitaplar getiriliyor...</span>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                  Aradığınız ISBN kriterine uygun kitap bulunamadı.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredBooks.map((book, index) => {
                    const categoryName = getCategoryByBook(book);
                    const bookIsbnVal = book.isbn || book.id?.isbn || "";
                    const uniqueKey = book.bookId ? `book-id-${book.bookId}` : (bookIsbnVal ? `book-isbn-${bookIsbnVal}` : `book-index-${index}`);

                    return (
                      <div key={uniqueKey} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-36 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-inner">
                            <img
                              src={getCoverUrl(book)}
                              alt={book.title || "Kitap Kapak"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-1 flex-1 justify-center flex flex-col">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-[#1A2B48]/70 bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                                {categoryName}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                ISBN: {bookIsbnVal}
                              </span>
                            </div>
                            <h4 className="text-base font-serif font-bold text-[#1A2B48] leading-snug">
                              {book.title || `Kitap`}
                            </h4>
                            <p className="text-xs font-medium text-gray-600">
                              {book.author || "Kayıtlı Yazar"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {book.pressName || "Yayınevi"} • {book.bookYear || "2024"}
                            </p>

                            <div className="pt-2 flex items-center space-x-2 text-xs text-gray-500">
                              <BookOpen size={14} className="text-[#1A2B48]" />
                              <span>{book.totalPages || 300} Sayfa</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToLibrary(book)}
                          className="w-full py-2 bg-[#F0F1F5] hover:bg-[#1A2B48] hover:text-white text-[#1A2B48] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Bookmark size={14} />
                          <span>Kütüphaneme Kaydet</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

       {/* MY LIBRARY (KÜTÜPHANEM) SEKME İÇERİĞİ */}
       {activeTab === 'library' && (
         <div className="space-y-8">
           <div>
             <h2 className="text-3xl font-serif font-bold text-[#1A2B48]">Kütüphanem</h2>
             <p className="text-sm text-gray-500 font-light mt-1">
               “Kitapsız bir oda, ruhsuz bir beden gibidir.” Özenle seçilmiş bu anlatılar eşliğinde yolculuğunuza devam edin.
             </p>
           </div>

           {/* İç Sekmeler */}
           <div className="flex space-x-8 border-b border-gray-200 text-sm font-medium text-gray-500">
             <button
               onClick={() => setLibrarySubTab('all')}
               className={`pb-3 transition-colors ${librarySubTab === 'all' ? 'border-b-2 border-[#1A2B48] text-[#1A2B48] font-bold' : 'hover:text-gray-900'}`}
             >
               Tüm Kitaplar ({myLibrary.length})
             </button>
             <button
               onClick={() => setLibrarySubTab('reading')}
               className={`pb-3 transition-colors ${librarySubTab === 'reading' ? 'border-b-2 border-[#1A2B48] text-[#1A2B48] font-bold' : 'hover:text-gray-900'}`}
             >
               Okunanlar
             </button>
             <button
               onClick={() => setLibrarySubTab('finished')}
               className={`pb-3 transition-colors ${librarySubTab === 'finished' ? 'border-b-2 border-[#1A2B48] text-[#1A2B48] font-bold' : 'hover:text-gray-900'}`}
             >
               Bitenler
             </button>
             <button
               onClick={() => setLibrarySubTab('onHold')}
               className={`pb-3 transition-colors ${librarySubTab === 'onHold' ? 'border-b-2 border-[#1A2B48] text-[#1A2B48] font-bold' : 'hover:text-gray-900'}`}
             >
               Beklemede
             </button>
           </div>

           {libraryLoading ? (
             <div className="flex items-center justify-center py-20 text-gray-400 space-x-2">
               <Loader2 className="animate-spin" size={24} />
               <span className="text-sm">Kütüphanen yükleniyor...</span>
             </div>
           ) : displayedLibraryBooks.length === 0 ? (
             <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
               <p className="text-base font-serif text-[#1A2B48]">Bu sekmede henüz gösterilecek kitap bulunmuyor.</p>
               <p className="text-xs text-gray-400">İlerlemeni güncelleyerek kitapları ilgili sekmelere taşıyabilirsin.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {displayedLibraryBooks.map((item, index) => {
                 const bookTotalPages = item.totalPages || item.book?.totalPages || 300;
                 const isUpdating = updatingItemId === item.id;

                 return (
                   <div key={item.id || index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                     <div className="space-y-3">
                       <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100 shadow-inner relative">
                         <img
                           src={getCoverUrl(item?.book ? item.book : item)}
                           alt={item?.title || "Kitap Kapak"}
                           className="w-full h-full object-cover"
                         />
                       </div>

                       <div>
                         <h4 className="text-base font-serif font-bold text-[#1A2B48] truncate">
                           {item.book?.title || "İsimsiz Kitap"}
                         </h4>
                         <p className="text-xs text-gray-500">{item.book?.author}</p>
                       </div>
                     </div>

                     {/* İlerleme Durumu ve Progress Bar */}
                     <div className="space-y-2 pt-2 border-t border-gray-100">
                       <div className="flex justify-between text-xs text-gray-600 font-medium">
                         <span>Sayfa {item.currentPage || 0} / {bookTotalPages}</span>
                         <span>{item.progressPercentage || 0}%</span>
                       </div>

                       <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                         <div
                           className="bg-[#1A2B48] h-full rounded-full transition-all duration-300"
                           style={{ width: `${item.progressPercentage || 0}%` }}
                         ></div>
                       </div>

                       {/* Güncelleme Alanı / Buton */}
                       {isUpdating ? (
                         <div className="space-y-2 pt-2">
                           <input
                             type="number"
                             placeholder="Kaldığın sayfa..."
                             value={inputPage}
                             onChange={(e) => setInputPage(e.target.value)}
                             className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#1A2B48]"
                             autoFocus
                           />
                           <div className="flex gap-2">
                             <button
                               onClick={() => handleUpdateProgress(item.id, bookTotalPages)}
                               className="flex-1 py-1.5 bg-[#1A2B48] text-white text-xs font-semibold rounded-lg hover:bg-[#121B2B] transition-colors"
                             >
                               Kaydet
                             </button>
                             <button
                               onClick={() => { setUpdatingItemId(null); setInputPage(''); }}
                               className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                             >
                               İptal
                             </button>
                           </div>
                         </div>
                       ) : (
                         <button
                           onClick={() => { setUpdatingItemId(item.id); setInputPage(item.currentPage || ''); }}
                           className="w-full mt-2 py-2.5 bg-[#1A2B48] hover:bg-[#121B2B] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                         >
                           <span>İlerlemeyi Güncelle</span>
                         </button>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
         </div>
       )}

        {/* 📝 NOTLARIM & YORUMLAR SEKME İÇERİĞİ */}
        {activeTab === 'notes' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#1A2B48]">Okuma Notlarım & Yorumlar</h2>
              <p className="text-sm text-gray-500 font-light mt-1">
                Okuduğun kitaplara puan ver, düşüncelerini ve kişisel notlarını kaydet.
              </p>
            </div>

            {/* Yeni Not Ekleme Formu */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-serif font-bold text-[#1A2B48] flex items-center space-x-2">
                <MessageSquare size={20} className="text-[#1A2B48]" />
                <span>Yeni Kitap Notu veya Yorumu Ekle</span>
              </h3>

              <form onSubmit={handleSaveNote} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Kitap Seçimi */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">Kitap Seç</label>
                    <select
                      value={selectedBookForNote}
                      onChange={(e) => setSelectedBookForNote(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1A2B48]"
                    >
                      <option value="">Kütüphanenden bir kitap seç...</option>
                      {myLibrary.map((item, idx) => (
                        <option key={item.id || idx} value={item.id || item.book?.title}>
                          {item.book?.title || "İsimsiz Kitap"} ({item.book?.author || "Yazar"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Puan Seçimi (1-5 Yıldız) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">Puan Ver</label>
                    <div className="flex items-center space-x-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={`star-${star}`}
                          onClick={() => setCurrentRating(star)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={star <= currentRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-gray-700 ml-2">({currentRating}/5 Yıldız)</span>
                    </div>
                  </div>

                </div>

                {/* Not / Yorum Metin Alanı */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Kişisel Notun / Alıntılar / Yorumun</label>
                  <textarea
                    rows="3"
                    placeholder="Bu kitap hakkında ne düşünüyorsun? Altını çizdiğin yerler neler?"
                    value={currentNoteText}
                    onChange={(e) => setCurrentNoteText(e.target.value)}
                    className="w-full p-4 bg-gray-50 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1A2B48] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A2B48] hover:bg-[#121B2B] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Notu Kaydet
                </button>
              </form>
            </div>

            {/* Kaydedilen Notlar Listesi */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-[#1A2B48]">Kaydettiğim Notlar ve Değerlendirmeler</h3>

              {Object.keys(bookNotes).length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <p className="text-base font-serif text-[#1A2B48]">Henüz hiç not eklemedin.</p>
                  <p className="text-xs text-gray-400">Yukarıdaki formu kullanarak okuduğun kitaplara yorum ve puan ekleyebilirsin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(bookNotes).map(([itemId, noteData]) => {
                    const libraryItem = myLibrary.find(i => String(i.id) === String(itemId));
                    const bookTitle = libraryItem?.book?.title || "Kitap";
                    const bookAuthor = libraryItem?.book?.author || "Yazar";
                    const bookCover = libraryItem?.book?.cover;

                    return (
                      <div key={itemId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              {bookCover && (
                                <img src={bookCover} alt={bookTitle} className="w-10 h-14 object-cover rounded-lg shadow-sm" />
                              )}
                              <div>
                                <h4 className="text-base font-serif font-bold text-[#1A2B48]">{bookTitle}</h4>
                                <p className="text-xs text-gray-500">{bookAuthor}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{noteData.date}</span>
                          </div>

                          {/* Yıldızlar */}
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={`note-star-${s}`}
                                size={14}
                                className={s <= noteData.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                              />
                            ))}
                          </div>

                          <p className="text-xs text-gray-700 bg-[#FDFBF7] p-4 rounded-xl border border-gray-100/80 leading-relaxed italic">
                            "{noteData.note}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );

}