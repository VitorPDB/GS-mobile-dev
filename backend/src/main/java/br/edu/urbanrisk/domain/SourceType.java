package br.edu.urbanrisk.domain;

public enum SourceType {
    SENSOR("Sensor simulado", 0.90), PUBLIC_DATA("Base pública simulada", 0.80), COMMUNITY("Registro comunitário simulado", 0.55);
    public final String label;
    public final double confidence;
    SourceType(String label, double confidence) { this.label = label; this.confidence = confidence; }
}
