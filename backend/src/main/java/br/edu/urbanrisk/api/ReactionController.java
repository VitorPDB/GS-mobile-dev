package br.edu.urbanrisk.api;

import br.edu.urbanrisk.domain.Vote;
import br.edu.urbanrisk.service.ReactionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readings")
public class ReactionController {
    private final ReactionService service;
    public ReactionController(ReactionService service) {this.service=service;}
    public record Input(@NotNull UUID clientId,@NotNull Vote vote) {}
    @PutMapping("/{readingId}/reaction") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void react(@PathVariable long readingId,@Valid @RequestBody Input input) {
        service.react(readingId,input.clientId,input.vote);
    }
}
