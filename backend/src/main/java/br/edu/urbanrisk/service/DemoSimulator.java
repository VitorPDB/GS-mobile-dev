package br.edu.urbanrisk.service;

import br.edu.urbanrisk.domain.*;
import br.edu.urbanrisk.repository.ReadingRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DemoSimulator {
    private final MonitoringService service;
    private final ReadingRepository repository;
    private final Clock clock;
    private final boolean enabled;
    private final AtomicInteger sequence=new AtomicInteger();
    public DemoSimulator(MonitoringService service,ReadingRepository repository,Clock clock,@Value("${app.demo}") boolean enabled) {
        this.service=service; this.repository=repository; this.clock=clock; this.enabled=enabled;
    }
    @EventListener(ApplicationReadyEvent.class)
    public void seed() { if(enabled && repository.count()==0) tick(); }
    @Scheduled(initialDelay=12000,fixedDelay=12000)
    public void schedule() { if(enabled) tick(); }
    @Scheduled(initialDelay=60000,fixedDelay=3600000)
    public void cleanup() { service.prune(); }
    public synchronized void tick() {
        int step=sequence.getAndIncrement()%4;
        String[] districts={"Vila Esperança","Jardim das Flores","Centro"};
        Instant observedAt=clock.instant();
        List<Reading> batch=new ArrayList<>();
        for(int i=0;i<3;i++) {
            batch.add(new Reading(RiskType.FLOOD,SourceType.SENSOR,districts[i],new double[]{55,32,8}[i]+step*2,observedAt));
            batch.add(new Reading(RiskType.HEAT,SourceType.PUBLIC_DATA,districts[i],new double[]{34,40,29}[i]+step*.4,observedAt));
            batch.add(new Reading(RiskType.OUTAGE,SourceType.COMMUNITY,districts[i],new double[]{20,75,130}[i]+step*3,observedAt));
        }
        service.ingestBatch(batch);
    }
}
