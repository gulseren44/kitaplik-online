package com.kitaplik.book_service.config;

import com.kitaplik.book_service.model.Book;
import com.kitaplik.book_service.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(BookRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                try {
                    repository.saveAll(Arrays.asList(
                            // --- FANTASTİK ---
                            new Book("Dünyanın Gözü", 2000, "Robert Jordan", "İthaki Yayınevi", "1001", 800),
                            new Book("Yüzüklerin Efendisi", 1954, "J.R.R. Tolkien", "Metis Yayıncılık", "1002", 1026),
                            new Book("Harry Potter ve Felsefe Taşı", 1997, "J.K. Rowling", "YKB Yayınları", "1003", 276),
                            new Book("Kralların Yolu", 2010, "Brandon Sanderson", "Akıl Çelçen", "1004", 960),
                            new Book("Rüzgarın Adı", 2007, "Patrick Rothfuss", "İthaki Yayınevi", "1005", 736),
                            new Book("Hobbit", 1937, "J.R.R. Tolkien", "İthaki Yayınevi", "1006", 320),

                            // --- EDEBİYAT ---
                            new Book("Tutunamayanlar", 1972, "Oğuz Atay", "İletişim Yayınları", "2001", 724),
                            new Book("Şeker Portakalı", 1968, "José Mauro de Vasconcelos", "Can Yayınları", "2002", 184),
                            new Book("Kürk Mantolu Madonna", 1943, "Sabahattin Ali", "YKB Yayınları", "2003", 160),
                            new Book("Simyacı", 1988, "Paulo Coelho", "Can Yayınları", "2004", 184),
                            new Book("Küçük Prens", 1943, "Antoine de Saint-Exupéry", "Can Yayınları", "2005", 96),
                            new Book("Saatleri Ayarlama Enstitüsü", 1961, "Ahmet Hamdi Tanpınar", "Dergâh Yayınları", "2006", 382),

                            // --- BİLİM KURGU ---
                            new Book("Dune", 1965, "Frank Herbert", "İthaki Yayınevi", "3001", 712),
                            new Book("1984", 1949, "George Orwell", "Can Yayınları", "3002", 352),
                            new Book("Cesur Yeni Dünya", 1932, "Aldous Huxley", "İthaki Yayınevi", "3003", 272),
                            new Book("Vakıf", 1951, "Isaac Asimov", "İthaki Yayınevi", "3004", 256),
                            new Book("Fahrenheit 451", 1953, "Ray Bradbury", "İthaki Yayınevi", "3005", 208),
                            new Book("Otostopçunun Galaksi Rehberi", 1979, "Douglas Adams", "Alfa Yayınları", "3006", 208),

                            // --- KLASİKLER ---
                            new Book("Suç ve Ceza", 1866, "Fyodor Dostoyevski", "İş Bankası Yayınları", "4001", 687),
                            new Book("Gurur ve Önyargı", 1813, "Jane Austen", "İş Bankası Yayınları", "4002", 424),
                            new Book("Sefiller", 1862, "Victor Hugo", "İş Bankası Yayınları", "4003", 1724),
                            new Book("Dönüşüm", 1915, "Franz Kafka", "Can Yayınları", "4004", 104),
                            new Book("İki Şehrin Hikayesi", 1859, "Charles Dickens", "Can Yayınları", "4005", 464),
                            new Book("Karamazov Kardeşler", 1880, "Fyodor Dostoyevski", "İş Bankası Yayınları", "4006", 1080),

                            // --- TARİH ---
                            new Book("Sapiens: İnsan Türünün Kısa Bir Tarihi", 2011, "Yuval Noah Harari", "Kolektif Kitap", "5001", 412),
                            new Book("Tüfek, Mikrop ve Çelik", 1997, "Jared Diamond", "Pegasus Yayınları", "5002", 664),
                            new Book("İlber Ortaylı ile Yakın Tarihin Gerçekleri", 2012, "İlber Ortaylı", "Timaş Yayınları", "5003", 256),
                            new Book("Devlet", 2000, "Platon", "İş Bankası Yayınları", "5004", 392),
                            new Book("Ortadoğu Tarihi", 1995, "Bernard Lewis", "Arkadaş Yayıncılık", "5005", 512),
                            new Book("Osmanlı İmparatorluğu Klasik Çağ", 1973, "Halil İnalcık", "Kronik Kitap", "5006", 340)
                    ));

                    System.out.println(" 30 adet başlangıç kitabı H2 veritabanına başarıyla yüklendi!");
                } catch (Exception e) {
                    System.err.println(" Kitaplar yüklenirken hata oluştu: " + e.getMessage());
                }
            } else {
                System.out.println("ℹ Veritabanında zaten " + repository.count() + " adet kitap mevcut.");
            }
        };
    }
}