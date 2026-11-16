package br.edu.urbanrisk;

import br.edu.urbanrisk.domain.*;
import br.edu.urbanrisk.service.RiskAnalyzer;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc
class MonitoringTest {
    @Autowired MockMvc mvc;
    @Test void healthAndEmptyDashboard() throws Exception {
        mvc.perform(get("/actuator/health")).andExpect(status().isOk());
        mvc.perform(get("/api/dashboard")).andExpect(status().isOk()).andExpect(jsonPath("$.simulated").value(true));
    }
    @Test void ingestionRequiresTokenAndValidatesValues() throws Exception {
        String body="{\"type\":\"HEAT\",\"source\":\"SENSOR\",\"district\":\"Centro\",\"value\":41}";
        mvc.perform(post("/api/readings").contentType("application/json").content(body)).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/readings").header("X-Ingest-Token","test-secret").contentType("application/json").content(body)).andExpect(status().isCreated());
        mvc.perform(get("/api/dashboard")).andExpect(jsonPath("$.alerts[0].severity").value("Crítico")).andExpect(jsonPath("$.alerts[0].confidence").value(.9));
        mvc.perform(post("/api/readings").header("X-Ingest-Token","test-secret").contentType("application/json").content(body.replace("41","80"))).andExpect(status().isBadRequest());
        mvc.perform(post("/api/readings").header("X-Ingest-Token","test-secret").contentType("application/json").content(body.replace("41","null"))).andExpect(status().isBadRequest());
        mvc.perform(post("/api/readings").header("X-Ingest-Token","test-secret").contentType("application/json").content(body.replace("Centro","<script>"))).andExpect(status().isBadRequest());
        mvc.perform(post("/api/demo/tick").header("X-Ingest-Token","test-secret")).andExpect(status().isNotFound());
    }
    @Test void timeAndCorsAreRestricted() throws Exception {
        mvc.perform(post("/api/readings").header("X-Ingest-Token","test-secret").contentType("application/json").content("{\"type\":\"FLOOD\",\"source\":\"COMMUNITY\",\"district\":\"Centro\",\"value\":60,\"observedAt\":\"2099-01-01T00:00:00Z\"}")).andExpect(status().isBadRequest());
        mvc.perform(options("/api/dashboard").header("Origin","https://untrusted.example").header("Access-Control-Request-Method","GET")).andExpect(status().isForbidden());
    }
    @Test void boundariesTrendAndStalenessDoNotSuppressDanger() {
        RiskAnalyzer analyzer=new RiskAnalyzer(); Instant now=Instant.now();
        for(RiskType type:RiskType.values()) {
            double threshold=switch(type){case FLOOD->50; case HEAT->40;case OUTAGE->120;};
            Reading r=new Reading(type,SourceType.COMMUNITY,"Centro",threshold,now.minusSeconds(120)); r.id=1L;
            var alert=analyzer.analyze(r,null,now);
            assertEquals("Crítico",alert.severity()); assertTrue(alert.stale()); assertEquals(.55,alert.confidence());
        }
        Reading before=new Reading(RiskType.HEAT,SourceType.SENSOR,"Centro",35,now.minusSeconds(10));
        Reading after=new Reading(RiskType.HEAT,SourceType.SENSOR,"Centro",40,now); after.id=2L;
        assertEquals(95,analyzer.analyze(after,before,now).score());
        assertTrue(analyzer.analyze(after,before,now).explanation().contains("90 de base + 5 por elevação = 95/100"));
        before.observedAt=now.minusSeconds(1800);
        assertEquals(95,analyzer.analyze(after,before,now).score());
        before.observedAt=now.minusSeconds(1801);
        assertEquals("Sem histórico comparável",analyzer.analyze(after,before,now).trend());
        assertEquals(90,analyzer.analyze(after,before,now).score());
        before.observedAt=now.minusSeconds(10);
        before.source=SourceType.COMMUNITY;
        assertEquals("Sem histórico comparável",analyzer.analyze(after,before,now).trend());
    }
}
