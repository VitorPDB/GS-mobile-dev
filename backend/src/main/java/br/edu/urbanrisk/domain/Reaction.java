package br.edu.urbanrisk.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="community_reaction",uniqueConstraints=@UniqueConstraint(name="uq_reaction_client",columnNames={"alert_key","client_id"}),
    indexes=@Index(name="idx_reaction_window",columnList="alert_key,updated_at"))
public class Reaction {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(name="alert_key",nullable=false,length=100) public String alertKey;
    @Column(name="client_id",nullable=false) public UUID clientId;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Vote vote;
    @Column(name="updated_at",nullable=false) public Instant updatedAt;
    @Version public long version;
    protected Reaction() {}
    public Reaction(String alertKey,UUID clientId,Vote vote,Instant updatedAt) {
        this.alertKey=alertKey;this.clientId=clientId;this.vote=vote;this.updatedAt=updatedAt;
    }
}
