package br.edu.urbanrisk.repository;

import br.edu.urbanrisk.domain.*;
import java.time.Instant;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ReactionRepository extends JpaRepository<Reaction,Long> {
    Optional<Reaction> findByAlertKeyAndClientId(String alertKey,UUID clientId);
    List<Reaction> findByClientIdAndAlertKeyInAndUpdatedAtAfter(UUID clientId,Collection<String> keys,Instant after);
    interface Count { String getAlertKey(); Vote getVote(); long getTotal(); }
    @Query("select r.alertKey as alertKey,r.vote as vote,count(r) as total from Reaction r where r.alertKey in :keys and r.updatedAt > :after group by r.alertKey,r.vote")
    List<Count> countWindow(@Param("keys") Collection<String> keys,@Param("after") Instant after);
    long deleteByUpdatedAtBefore(Instant before);
}
