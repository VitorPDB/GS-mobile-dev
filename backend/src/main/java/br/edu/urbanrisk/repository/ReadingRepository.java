package br.edu.urbanrisk.repository;

import br.edu.urbanrisk.domain.Reading;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingRepository extends JpaRepository<Reading, Long> {
    List<Reading> findTop1000ByOrderByObservedAtDescIdDesc();
    long deleteByObservedAtBefore(Instant before);
}
