package br.edu.urbanrisk.service;

import br.edu.urbanrisk.domain.*;
import br.edu.urbanrisk.repository.*;
import java.time.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReactionService {
    public static final double SOURCE_WEIGHT=4;
    private final ReactionRepository reactions;
    private final ReadingRepository readings;
    private final Clock clock;
    public ReactionService(ReactionRepository reactions,ReadingRepository readings,Clock clock) {
        this.reactions=reactions;this.readings=readings;this.clock=clock;
    }
    public record Feedback(long likes,long dislikes,Vote myVote) {
        public static Feedback empty() {return new Feedback(0,0,Vote.NONE);}
        public double confidence(double base) {return (base*SOURCE_WEIGHT+likes)/(SOURCE_WEIGHT+likes+dislikes);}
        public String explanation(double base) {
            return String.format(Locale.ROOT,"(%.2f × 4 + %d likes) ÷ (4 + %d likes + %d dislikes). Votos das últimas 24 h para este risco e bairro; não representam probabilidade de ocorrência.",base,likes,likes,dislikes);
        }
    }
    public static String key(Reading r) {return r.type.name()+":"+r.district;}
    @Transactional(readOnly=true)
    public Map<String,Feedback> summaries(Collection<String> keys,UUID clientId) {
        if(keys.isEmpty())return Map.of();
        Instant after=clock.instant().minus(Duration.ofHours(24));
        Map<String,long[]> counts=new HashMap<>();
        reactions.countWindow(keys,after).forEach(c->{
            long[] n=counts.computeIfAbsent(c.getAlertKey(),k->new long[2]);
            if(c.getVote()==Vote.LIKE)n[0]=c.getTotal();
            if(c.getVote()==Vote.DISLIKE)n[1]=c.getTotal();
        });
        Map<String,Vote> mine=new HashMap<>();
        if(clientId!=null)reactions.findByClientIdAndAlertKeyInAndUpdatedAtAfter(clientId,keys,after).forEach(r->mine.put(r.alertKey,r.vote));
        Map<String,Feedback> result=new HashMap<>();
        keys.forEach(k->{long[] n=counts.getOrDefault(k,new long[2]);result.put(k,new Feedback(n[0],n[1],mine.getOrDefault(k,Vote.NONE)));});
        return result;
    }
    @Transactional
    public void react(long readingId,UUID clientId,Vote vote) {
        Reading reading=readings.findById(readingId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Leitura não encontrada."));
        if(clock.instant().isAfter(reading.observedAt.plusSeconds(90)))
            throw new ResponseStatusException(HttpStatus.CONFLICT,"A leitura está antiga. Atualize antes de votar.");
        String key=key(reading);
        Optional<Reaction> existing=reactions.findByAlertKeyAndClientId(key,clientId);
        if(vote==Vote.NONE) {existing.ifPresent(reactions::delete);return;}
        if(existing.isPresent()) {
            Reaction reaction=existing.get();
            if(reaction.vote==vote && reaction.updatedAt.isAfter(clock.instant().minus(Duration.ofHours(24))))return;
            reaction.vote=vote;reaction.updatedAt=clock.instant();reactions.save(reaction);
        } else reactions.save(new Reaction(key,clientId,vote,clock.instant()));
        reactions.flush();
    }
    @Scheduled(initialDelay=60000,fixedDelay=3600000)
    @Transactional
    public void cleanup() {reactions.deleteByUpdatedAtBefore(clock.instant().minus(Duration.ofHours(24)));}
}
