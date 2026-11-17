package br.edu.urbanrisk.service;

import br.edu.urbanrisk.domain.*;
import br.edu.urbanrisk.repository.ReadingRepository;
import java.time.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MonitoringService {
    private final ReadingRepository repository;
    private final RiskAnalyzer analyzer;
    private final Clock clock;
    private final ReactionService reactions;
    public MonitoringService(ReadingRepository repository,RiskAnalyzer analyzer,Clock clock,ReactionService reactions) {
        this.repository=repository; this.analyzer=analyzer; this.clock=clock; this.reactions=reactions;
    }
    public record Dashboard(Instant serverTime, boolean simulated, List<RiskAnalyzer.Alert> alerts, List<Reading> readings, long storedReadings) {}
    @Transactional(readOnly=true)
    public Dashboard dashboard() {
        return dashboard(null);
    }
    @Transactional(readOnly=true)
    public Dashboard dashboard(UUID clientId) {
        List<Reading> rows = repository.findTop1000ByOrderByObservedAtDescIdDesc();
        Map<String,List<Reading>> groups = new LinkedHashMap<>();
        rows.forEach(r -> groups.computeIfAbsent(r.type+":"+r.district,k->new ArrayList<>()).add(r));
        Map<String,ReactionService.Feedback> feedback=reactions.summaries(groups.keySet(),clientId);
        List<RiskAnalyzer.Alert> alerts = groups.values().stream().map(g -> {
            Reading latest=g.getFirst();
            Reading previous=g.stream().skip(1).filter(r->r.source==latest.source && r.observedAt.isBefore(latest.observedAt)).findFirst().orElse(null);
            return analyzer.analyze(latest,previous,clock.instant(),feedback.getOrDefault(ReactionService.key(latest),ReactionService.Feedback.empty()));
        }).sorted(Comparator.comparingInt(RiskAnalyzer.Alert::score).reversed().thenComparing(RiskAnalyzer.Alert::id)).toList();
        return new Dashboard(clock.instant(),true,alerts,rows.stream().limit(30).toList(),repository.count());
    }
    @Transactional
    public Reading ingest(RiskType type,SourceType source,String district,double value,Instant observedAt) {
        Instant now=clock.instant();
        Instant time=observedAt==null?now:observedAt;
        if(!Double.isFinite(value) || value<0 || value>type.max) throw new IllegalArgumentException("Valor fora da faixa para "+type+": 0 a "+type.max);
        if(time.isAfter(now.plusSeconds(30)) || time.isBefore(now.minus(Duration.ofHours(24))))
            throw new IllegalArgumentException("Horário deve estar nas últimas 24 horas, com tolerância futura de 30 segundos.");
        return repository.save(new Reading(type,source,district.strip(),value,time));
    }
    @Transactional public void ingestBatch(List<Reading> batch) {
        batch.forEach(r->ingest(r.type,r.source,r.district,r.value,r.observedAt));
    }
    @Transactional public void prune() { repository.deleteByObservedAtBefore(clock.instant().minus(Duration.ofDays(7))); }
}
