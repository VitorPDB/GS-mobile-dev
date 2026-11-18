package br.edu.urbanrisk.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(indexes = {
    @Index(name="idx_reading_time",columnList="observedAt"),
    @Index(name="idx_reading_latest",columnList="type,district,observedAt,id"),
    @Index(name="idx_reading_source",columnList="type,district,source,observedAt,id")
})
public class Reading {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public RiskType type;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public SourceType source;
    @Column(nullable=false, length=60) public String district;
    @Column(name="measured_value",nullable=false) public double value;
    @Column(nullable=false) public Instant observedAt;
    protected Reading() {}
    public Reading(RiskType type, SourceType source, String district, double value, Instant observedAt) {
        this.type=type; this.source=source; this.district=district; this.value=value; this.observedAt=observedAt;
    }
}
