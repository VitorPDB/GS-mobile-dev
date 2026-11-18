package br.edu.urbanrisk;

import br.edu.urbanrisk.domain.*;
import br.edu.urbanrisk.repository.ReadingRepository;
import br.edu.urbanrisk.service.*;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest @Transactional
class CoverageTest {
    @Autowired ReadingRepository readings;
    @Autowired MonitoringService monitoring;
    @Autowired Clock clock;
    @Test void silentCriticalDistrictSurvivesMoreThan1000OtherReadings() {
        readings.deleteAll();
        Instant now=clock.instant();
        Reading silent=readings.save(new Reading(RiskType.FLOOD,SourceType.SENSOR,"Bairro silencioso",60,now.minusSeconds(120)));
        List<Reading> busy=new ArrayList<>();
        for(int i=0;i<1001;i++)busy.add(new Reading(RiskType.HEAT,SourceType.SENSOR,"Bairro ativo",32,now.minusMillis(1001-i)));
        readings.saveAll(busy);
        var dashboard=monitoring.dashboard();
        assertEquals(2,dashboard.alerts().size());
        var alert=dashboard.alerts().stream().filter(a->a.readingId()==silent.id).findFirst().orElseThrow();
        assertEquals("Crítico",alert.severity());assertTrue(alert.stale());
        assertEquals(30,dashboard.readings().size());assertEquals(1002,dashboard.storedReadings());
    }
    @Test void latestUsesTimestampThenIdAndTrendStaysWithinSource() {
        readings.deleteAll();Instant now=clock.instant();
        readings.save(new Reading(RiskType.HEAT,SourceType.SENSOR,"Centro",35,now.minusSeconds(10)));
        readings.save(new Reading(RiskType.HEAT,SourceType.COMMUNITY,"Centro",50,now.minusSeconds(5)));
        readings.save(new Reading(RiskType.HEAT,SourceType.SENSOR,"Centro",39,now));
        Reading winner=readings.save(new Reading(RiskType.HEAT,SourceType.SENSOR,"Centro",40,now));
        var alert=monitoring.dashboard().alerts().getFirst();
        assertEquals(winner.id.longValue(),alert.readingId());assertEquals("Em elevação",alert.trend());assertEquals(95,alert.score());
    }
    @Test void staleBeginsImmediatelyAfter90Seconds() {
        Instant observed=clock.instant();Reading r=new Reading(RiskType.FLOOD,SourceType.SENSOR,"Centro",60,observed);r.id=1L;
        RiskAnalyzer analyzer=new RiskAnalyzer();
        assertFalse(analyzer.analyze(r,null,observed.plusSeconds(90)).stale());
        assertTrue(analyzer.analyze(r,null,observed.plusSeconds(90).plusMillis(1)).stale());
    }
}
