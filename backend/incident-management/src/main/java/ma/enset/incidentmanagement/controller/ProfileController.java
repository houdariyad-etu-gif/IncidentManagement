package ma.enset.incidentmanagement.controller;

import jakarta.validation.Valid;
import ma.enset.incidentmanagement.dto.request.UpdateProfileRequest;
import ma.enset.incidentmanagement.dto.response.UserResponse;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.exception.ResourceNotFoundException;
import ma.enset.incidentmanagement.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        User user = getCurrentUser(authentication);
        user.setFullName(request.fullName().trim());

        User updatedUser = userService.save(user);

        return ResponseEntity.ok(toResponse(updatedUser));
    }

    private User getCurrentUser(Authentication authentication) {
        return userService.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Authenticated user not found"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}