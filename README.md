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

   ### **AYRAÇ**
  
<img width="1872" height="971" alt="Ekran görüntüsü 2026-08-05 163136" src="https://github.com/user-attachments/assets/54560465-b7ab-459d-b6dc-b4497624666b" />
 
<img width="1890" height="860" alt="Ekran görüntüsü 2026-08-05 145755" src="https://github.com/user-attachments/assets/8879b4b1-826c-4e6c-9005-051e98f09d7c" />

<img width="1828" height="917" alt="Ekran görüntüsü 2026-08-05 162935" src="https://github.com/user-attachments/assets/b5232d62-593f-4c80-9a33-1b01e85d8640" />

<img width="1842" height="962" alt="Ekran görüntüsü 2026-08-05 145909" src="https://github.com/user-attachments/assets/09dcaa20-6f5b-431b-bab2-2ee0b56b855d" />
