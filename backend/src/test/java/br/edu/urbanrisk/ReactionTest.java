package br.edu.urbanrisk;

import br.edu.urbanrisk.domain.*;
import br.edu.urbanrisk.repository.*;
import br.edu.urbanrisk.service.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.*;
import org.springframework.context.annotation.*;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.closeTo;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc
class ReactionTest {
    @TestConfiguration static class FixedTime {
        @Bean @Primary Clock reactionClock() {return Clock.fixed(Instant.parse("2026-11-16T12:00:00Z"),ZoneOffset.UTC);}
    }
    @Autowired MockMvc mvc;
    @Autowired ReadingRepository readings;
    @Autowired ReactionRepository reactions;
    @Autowired ReactionService service;
    @Autowired RiskAnalyzer analyzer;
    @Autowired Clock clock;
    @BeforeEach void reset() {reactions.deleteAll();readings.deleteAll();}
    Reading reading(String district) {return readings.save(new Reading(RiskType.HEAT,SourceType.SENSOR,district,41,clock.instant()));}
    void vote(long id,UUID client,Vote vote) throws Exception {
        mvc.perform(put("/api/readings/"+id+"/reaction").contentType("application/json")
            .content("{\"clientId\":\""+client+"\",\"vote\":\""+vote+"\"}")).andExpect(status().isNoContent());
    }
    @Test void likeDislikeSwitchRemoveAndIdempotency() throws Exception {
        Reading r=reading("Centro");UUID client=UUID.randomUUID();
        vote(r.id,client,Vote.LIKE);vote(r.id,client,Vote.LIKE);
        mvc.perform(get("/api/dashboard").header("X-Client-Id",client))
            .andExpect(jsonPath("$.alerts[0].likes").value(1)).andExpect(jsonPath("$.alerts[0].dislikes").value(0))
            .andExpect(jsonPath("$.alerts[0].myVote").value("LIKE"))
            .andExpect(jsonPath("$.alerts[0].confidence").value(closeTo(.92,1e-10)));
        vote(r.id,client,Vote.DISLIKE);
        mvc.perform(get("/api/dashboard").header("X-Client-Id",client))
            .andExpect(jsonPath("$.alerts[0].likes").value(0)).andExpect(jsonPath("$.alerts[0].dislikes").value(1))
            .andExpect(jsonPath("$.alerts[0].confidence").value(closeTo(.72,1e-10)));
        vote(r.id,client,Vote.NONE);
        mvc.perform(get("/api/dashboard").header("X-Client-Id",client))
            .andExpect(jsonPath("$.alerts[0].myVote").value("NONE"))
            .andExpect(jsonPath("$.alerts[0].confidence").value(.9));
        assertEquals(0,reactions.count());
    }
    @Test void votesSurviveNewReadingButExpireAfter24Hours() throws Exception {
        Reading first=reading("Jardim");UUID client=UUID.randomUUID();
        vote(first.id,client,Vote.LIKE);
        Reading latest=readings.save(new Reading(RiskType.HEAT,SourceType.SENSOR,"Jardim",42,clock.instant()));
        mvc.perform(get("/api/dashboard").header("X-Client-Id",client))
            .andExpect(jsonPath("$.alerts[0].readingId").value(latest.id))
            .andExpect(jsonPath("$.alerts[0].likes").value(1)).andExpect(jsonPath("$.alerts[0].myVote").value("LIKE"));
        Reaction expired=reactions.findAll().getFirst();expired.updatedAt=clock.instant().minus(Duration.ofHours(24));reactions.saveAndFlush(expired);
        mvc.perform(get("/api/dashboard").header("X-Client-Id",client))
            .andExpect(jsonPath("$.alerts[0].likes").value(0)).andExpect(jsonPath("$.alerts[0].myVote").value("NONE"));
        vote(latest.id,client,Vote.LIKE);
        assertEquals(1,service.summaries(List.of(ReactionService.key(latest)),client).get(ReactionService.key(latest)).likes());
    }
    @Test void votesCannotSuppressPhysicalSeverityAndFormulaIsBounded() {
        Reading r=reading("Centro");
        var negative=analyzer.analyze(r,null,clock.instant(),new ReactionService.Feedback(0,100,Vote.DISLIKE));
        assertEquals("Crítico",negative.severity());assertEquals(90,negative.score());
        assertTrue(negative.confidence()>0&&negative.confidence()<.1);
        var positive=analyzer.analyze(r,null,clock.instant(),new ReactionService.Feedback(100,0,Vote.LIKE));
        assertTrue(positive.confidence()>.9&&positive.confidence()<1);
        assertEquals(.9,ReactionService.Feedback.empty().confidence(.9));
    }
    @Test void staleMissingAndMalformedVotesAreRejected() throws Exception {
        Reading r=readings.save(new Reading(RiskType.HEAT,SourceType.SENSOR,"Antigo",41,clock.instant().minusSeconds(91)));
        String body="{\"clientId\":\""+UUID.randomUUID()+"\",\"vote\":\"LIKE\"}";
        mvc.perform(put("/api/readings/"+r.id+"/reaction").contentType("application/json").content(body)).andExpect(status().isConflict());
        mvc.perform(put("/api/readings/999999/reaction").contentType("application/json").content(body)).andExpect(status().isNotFound());
        mvc.perform(put("/api/readings/"+r.id+"/reaction").contentType("application/json").content("{\"vote\":\"LIKE\"}")).andExpect(status().isBadRequest());
        mvc.perform(put("/api/readings/"+r.id+"/reaction").contentType("application/json").content(body.replace("LIKE","UNKNOWN"))).andExpect(status().isBadRequest());
        mvc.perform(options("/api/readings/"+r.id+"/reaction").header("Origin","http://localhost:8081").header("Access-Control-Request-Method","PUT").header("Access-Control-Request-Headers","content-type,x-client-id")).andExpect(status().isOk());
    }
    @Test void concurrentRetriesDoNotDuplicateOneInstallationsVote() throws Exception {
        Reading r=reading("Concorrencia");UUID client=UUID.randomUUID();
        try(var pool=Executors.newFixedThreadPool(4)) {
            List<Callable<Boolean>> attempts=new ArrayList<>();
            for(int i=0;i<8;i++)attempts.add(()->{try {service.react(r.id,client,Vote.LIKE);return true;}
                catch(org.springframework.dao.DataIntegrityViolationException|org.springframework.dao.OptimisticLockingFailureException ex){return false;}});
            List<Future<Boolean>> results=pool.invokeAll(attempts);
            assertTrue(results.stream().anyMatch(f->{try{return f.get();}catch(Exception ex){throw new RuntimeException(ex);}}));
        }
        assertEquals(1,reactions.count());
    }
}
