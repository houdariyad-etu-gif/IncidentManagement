package ma.enset.incidentmanagement.controller;

import jakarta.validation.Valid;
import ma.enset.incidentmanagement.dto.response.AuthResponse;
import ma.enset.incidentmanagement.dto.request.LoginRequest;
import ma.enset.incidentmanagement.dto.request.RegisterRequest;
import ma.enset.incidentmanagement.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }
}
