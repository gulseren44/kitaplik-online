package com.kitaplik.gateway;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import reactor.core.publisher.Hooks;

@SpringBootApplication
public class GatewayApplication {

	@PostConstruct
	public void init() {
		// WebFlux / Reactive akışlarda Trace ID context'inin kaybolmasını engeller
		Hooks.enableAutomaticContextPropagation();
	}

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

}
