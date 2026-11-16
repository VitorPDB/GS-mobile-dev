package br.edu.urbanrisk.domain;

public enum RiskType {
    FLOOD("Alagamento", "mm/h", 300), HEAT("Calor extremo", "°C", 65), OUTAGE("Falta de energia", "min", 10080);
    public final String label;
    public final String unit;
    public final double max;
    RiskType(String label, String unit, double max) { this.label = label; this.unit = unit; this.max = max; }
}
