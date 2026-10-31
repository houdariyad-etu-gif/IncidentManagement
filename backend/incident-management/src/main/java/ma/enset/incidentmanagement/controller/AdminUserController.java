package ma.enset.incidentmanagement.controller;

import ma.enset.incidentmanagement.dto.response.UserResponse;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.exception.ResourceNotFoundException;
import ma.enset.incidentmanagement.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(
            Authentication authentication) {

        checkAdmin(authentication);

        List<UserResponse> users = userService.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/enable")
    public ResponseEntity<UserResponse> enableUser(
            @PathVariable Long id,
            Authentication authentication) {

        checkAdmin(authentication);

        User user = getUser(id);
        user.setEnabled(true);

        return ResponseEntity.ok(toResponse(userService.save(user)));
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<UserResponse> disableUser(
            @PathVariable Long id,
            Authentication authentication) {

        User admin = checkAdmin(authentication);

        User user = getUser(id);

        if (admin.getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "An administrator cannot disable their own account");
        }

        user.setEnabled(false);

        return ResponseEntity.ok(toResponse(userService.save(user)));
    }

    private User checkAdmin(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getRole() != ma.enset.incidentmanagement.enums.Role.ADMIN) {
            throw new AccessDeniedException("Administrator access required");
        }

        return user;
    }

    private User getUser(Long id) {
        return userService.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));
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