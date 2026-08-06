# 📚 Kitaplık Online - Microservices & Observability Platform

Bu proje, modern yazılım mimarileri prensiplerine uygun olarak geliştirilmiş, servis keşfi (Service Discovery), API Gateway, merkezi loglama, metrik toplama ve distributed tracing (dağıtık izleme) bileşenlerini barındıran tam kapsamlı bir **Mikroservis Mimarisi** uygulamasıdır.

---

## 🚀 Proje Mimarisi ve Kullanılan Teknolojiler

### **Backend & Servisler (Spring Boot & Spring Cloud)**
* **Java & Spring Boot:** Servislerin geliştirilmesi.
* **Spring Cloud Eureka Server:** Servis kayıt ve keşif (Service Discovery) mekanizması.
* **Spring Cloud Gateway:** Tüm istekleri karşılayan, yönlendiren ve güvenliği sağlayan API Gateway katmanı.
* **Book Service & Library Service & User Service:** İş mantığını yürüten bağımsız mikroservisler.

### **Frontend**
* **React & Vite:** Modern ve hızlı kullanıcı arayüzü (`ayrac-ui`).

### **Observability & DevOps (Gözlemlenebilirlik)**
* **Prometheus:** Servis metriklerinin toplanması ve izlenmesi (`/actuator/prometheus`).
* **Grafana Tempo:** Mikroservisler arası isteklerin (traces) takibi (Distributed Tracing).
* **Grafana Loki & Promtail:** Konteyner loglarının merkezi olarak toplanması ve sorgulanması.
* **Grafana:** Tüm metrik, log ve izleme verilerinin tek bir ekranda görselleştirilmesi (Dashboard).
* **Docker & Docker Compose:** Tüm altyapı servislerinin konteynerize edilmesi ve tek komutla ayağa kaldırılması.

  
