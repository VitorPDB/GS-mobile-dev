package br.edu.urbanrisk.service;

import br.edu.urbanrisk.domain.*;
import java.time.*;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class RiskAnalyzer {
    public record Alert(String id, long readingId, RiskType type, String title, String district, double value,
        String unit, SourceType source, String sourceLabel, double confidence, double baseConfidence,
        long likes,long dislikes,Vote myVote,String confidenceExplanation,int score, String severity,
        String trend, String explanation, String recommendation, Instant observedAt, boolean stale, boolean simulated) {}

    public Alert analyze(Reading r, Reading previous, Instant now) {
        return analyze(r,previous,now,ReactionService.Feedback.empty());
    }
    public Alert analyze(Reading r, Reading previous, Instant now,ReactionService.Feedback feedback) {
        double[] limits = switch(r.type) {
            case FLOOD -> new double[]{10,30,50};
            case HEAT -> new double[]{30,35,40};
            case OUTAGE -> new double[]{15,60,120};
        };
        int baseScore = r.value >= limits[2] ? 90 : r.value >= limits[1] ? 65 : r.value >= limits[0] ? 35 : 10;
        int score = baseScore;
        // Only comparable observations affect trend. Trust never suppresses physical severity.
        boolean comparable = previous != null && previous.source == r.source
            && previous.observedAt.isBefore(r.observedAt)
            && Duration.between(previous.observedAt,r.observedAt).compareTo(Duration.ofMinutes(30)) <= 0;
        double delta = comparable ? r.value - previous.value : 0;
        double tolerance = r.type == RiskType.HEAT ? 0.5 : 2;
        String trend = !comparable ? "Sem histórico comparável" : delta > tolerance ? "Em elevação" : delta < -tolerance ? "Em queda" : "Estável";
        if (delta > tolerance) score = Math.min(100, score + 5);
        String severity = score >= 85 ? "Crítico" : score >= 60 ? "Alto" : score >= 30 ? "Moderado" : "Baixo";
        boolean stale = now.isAfter(r.observedAt.plusSeconds(90));
        String basis = switch(r.type) { case FLOOD -> "Intensidade de chuva"; case HEAT -> "Temperatura do ar"; case OUTAGE -> "Duração da interrupção"; };
        String explanation = basis + " de " + r.value + " " + r.type.unit + ". Faixas demonstrativas: "
            + limits[0] + " / " + limits[1] + " / " + limits[2] + ". " + trend + ". "
            + "Pontuação: " + baseScore + " de base + " + (score-baseScore) + " por elevação = " + score + "/100."
            + (stale ? " Leitura antiga: confirme a situação antes de agir." : "");
        String recommendation = switch(r.type) {
            case FLOOD -> "Evite áreas alagadas e nunca atravesse água em movimento.";
            case HEAT -> "Procure sombra, hidrate-se e acompanhe pessoas vulneráveis.";
            case OUTAGE -> "Mantenha distância de fios caídos e consulte a distribuidora local.";
        };
        return new Alert(r.type.name()+":"+r.district,r.id,r.type,r.type.label,r.district,r.value,r.type.unit,
            r.source,r.source.label,feedback.confidence(r.source.confidence),r.source.confidence,
            feedback.likes(),feedback.dislikes(),feedback.myVote(),feedback.explanation(r.source.confidence),
            score,severity,trend,explanation,recommendation,r.observedAt,stale,true);
    }
}
