package br.edu.urbanrisk.api;

import br.edu.urbanrisk.domain.*;
import br.edu.urbanrisk.service.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class MonitoringController {
    private final MonitoringService service;
    private final DemoSimulator simulator;
    private final String token;
    private final boolean demo;
    public MonitoringController(MonitoringService service,DemoSimulator simulator,@Value("${app.ingest-token}") String token,@Value("${app.demo}") boolean demo) {
        this.service=service; this.simulator=simulator; this.token=token; this.demo=demo;
        if(!demo && (token.isBlank() || token.equals("local-demo-only"))) throw new IllegalStateException("Configure INGEST_TOKEN fora do modo demo.");
    }
    public record Input(@NotNull RiskType type,@NotNull SourceType source,
        @NotBlank @Size(max=60) @Pattern(regexp="[\\p{L}\\p{N} .'-]+") String district,
        @NotNull @DecimalMin("0") Double value,Instant observedAt) {}
    @GetMapping("/dashboard") public ResponseEntity<MonitoringService.Dashboard> dashboard(@RequestHeader(value="X-Client-Id",required=false) UUID clientId) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.dashboard(clientId));
    }
    @PostMapping("/readings") @ResponseStatus(HttpStatus.CREATED)
    public Reading ingest(@RequestHeader(value="X-Ingest-Token",defaultValue="") String key,@Valid @RequestBody Input input) {
        authorize(key); return service.ingest(input.type,input.source,input.district,input.value,input.observedAt);
    }
    @PostMapping("/demo/tick") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void tick(@RequestHeader(value="X-Ingest-Token",defaultValue="") String key) {
        authorize(key); if(!demo) throw new ResponseStatusException(HttpStatus.NOT_FOUND); simulator.tick();
    }
    private void authorize(String key) {
        if(!MessageDigest.isEqual(token.getBytes(StandardCharsets.UTF_8),key.getBytes(StandardCharsets.UTF_8)))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Chave de ingestão inválida.");
    }
}
