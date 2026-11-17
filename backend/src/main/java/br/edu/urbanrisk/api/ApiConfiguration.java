package br.edu.urbanrisk.api;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class ApiConfiguration implements WebMvcConfigurer {
    @Value("${app.cors-origins}") private String[] origins;
    @Override public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins(origins).allowedMethods("GET","POST","PUT").allowedHeaders("Content-Type","X-Ingest-Token","X-Client-Id");
    }
    @RestControllerAdvice
    public static class Errors {
        @ExceptionHandler({org.springframework.dao.DataIntegrityViolationException.class,org.springframework.dao.OptimisticLockingFailureException.class})
        public ResponseEntity<?> conflictingVote(Exception ex) {return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","O voto foi alterado ao mesmo tempo. Atualize e tente novamente."));}
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<?> invalid(IllegalArgumentException ex) { return ResponseEntity.badRequest().body(Map.of("message",ex.getMessage())); }
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<?> invalidFields(MethodArgumentNotValidException ex) { return ResponseEntity.badRequest().body(Map.of("message","Dados inválidos. Verifique tipo, origem, bairro e valor.")); }
    }
}
