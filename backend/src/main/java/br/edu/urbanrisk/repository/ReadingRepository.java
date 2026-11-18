package br.edu.urbanrisk.repository;

import br.edu.urbanrisk.domain.*;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReadingRepository extends JpaRepository<Reading, Long> {
    @Query("select r from Reading r where not exists (select newer.id from Reading newer where newer.type=r.type and newer.district=r.district and (newer.observedAt>r.observedAt or (newer.observedAt=r.observedAt and newer.id>r.id)))")
    List<Reading> findLatestPerRiskAndDistrict();
    Optional<Reading> findFirstByTypeAndDistrictAndSourceAndObservedAtLessThanOrderByObservedAtDescIdDesc(
        RiskType type,String district,SourceType source,Instant before);
    List<Reading> findTop30ByOrderByObservedAtDescIdDesc();
    long deleteByObservedAtBefore(Instant before);
}
