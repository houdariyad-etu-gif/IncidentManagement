package ma.enset.incidentmanagement.controller;

import ma.enset.incidentmanagement.dto.response.AdminStatisticsResponse;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.enums.IncidentStatus;
import ma.enset.incidentmanagement.enums.Role;
import ma.enset.incidentmanagement.exception.ResourceNotFoundException;
import ma.enset.incidentmanagement.repository.IncidentRepository;
import ma.enset.incidentmanagement.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/statistics")
public class AdminStatisticsController {

    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;

    public AdminStatisticsController(
            UserRepository userRepository,
            IncidentRepository incidentRepository) {
        this.userRepository = userRepository;
        this.incidentRepository = incidentRepository;
    }

    @GetMapping
    public ResponseEntity<AdminStatisticsResponse> getStatistics(
            Authentication authentication) {

        User admin = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Administrator access required");
        }

        long totalUsers = userRepository.count();
        long enabledUsers = userRepository.countByEnabled(true);
        long disabledUsers = userRepository.countByEnabled(false);

        long totalIncidents = incidentRepository.count();

        AdminStatisticsResponse response = new AdminStatisticsResponse(
                totalUsers,
                enabledUsers,
                disabledUsers,
                totalIncidents,
                incidentRepository.countByStatus(IncidentStatus.OPEN),
                incidentRepository.countByStatus(IncidentStatus.ASSIGNED),
                incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS),
                incidentRepository.countByStatus(IncidentStatus.RESOLVED),
                incidentRepository.countByStatus(IncidentStatus.CLOSED)
        );

        return ResponseEntity.ok(response);
    }
}