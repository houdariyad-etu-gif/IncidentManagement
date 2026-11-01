package ma.enset.incidentmanagement.controller;

import jakarta.validation.Valid;

import ma.enset.incidentmanagement.dto.request.UpdateIncidentStatusRequest;
import ma.enset.incidentmanagement.enums.IncidentStatus;
import ma.enset.incidentmanagement.enums.Role;
import ma.enset.incidentmanagement.exception.ResourceNotFoundException;
import ma.enset.incidentmanagement.dto.request.CreateIncidentRequest;
import ma.enset.incidentmanagement.dto.response.IncidentResponse;
import ma.enset.incidentmanagement.entity.Incident;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.service.IncidentService;
import ma.enset.incidentmanagement.service.UserService;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final UserService userService;

    public IncidentController(
            IncidentService incidentService,
            UserService userService) {
        this.incidentService = incidentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(
            @Valid @RequestBody CreateIncidentRequest request,
            Authentication authentication) {

        User employee = getAuthenticatedUser(authentication);

        Incident incident = new Incident();
        incident.setTitle(request.title().trim());
        incident.setDescription(request.description().trim());
        incident.setCategory(request.category());
        incident.setPriority(request.priority());

        Incident saved = incidentService.createIncident(incident, employee);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents(
            Authentication authentication) {

        User admin = getAuthenticatedUser(authentication);

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException(
                    "Only administrators can view all incidents"
            );
        }

        List<IncidentResponse> incidents = incidentService
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/my")
    public ResponseEntity<List<IncidentResponse>> getMyIncidents(
            Authentication authentication) {

        User employee = getAuthenticatedUser(authentication);

        List<IncidentResponse> incidents = incidentService
                .findByCreatedBy(employee)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        Incident incident = incidentService.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Incident not found with id: " + id
                        )
                );

        boolean isOwner = incident.getCreatedBy().getId()
                .equals(currentUser.getId());

        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

        boolean isAssignedTechnician =
                incident.getAssignedTo() != null
                        && incident.getAssignedTo().getId()
                        .equals(currentUser.getId());

        if (!isOwner && !isAdmin && !isAssignedTechnician) {
            throw new AccessDeniedException(
                    "You are not allowed to view this incident"
            );
        }

        return ResponseEntity.ok(toResponse(incident));
    }

    private User getAuthenticatedUser(Authentication authentication) {

        return userService.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        )
                );
    }

    private IncidentResponse toResponse(Incident incident) {

        return new IncidentResponse(
                incident.getId(),
                incident.getTitle(),
                incident.getDescription(),
                incident.getCategory(),
                incident.getPriority(),
                incident.getStatus(),
                incident.getCreatedAt(),
                incident.getUpdatedAt(),
                incident.getCreatedBy().getFullName(),
                incident.getAssignedTo() != null
                        ? incident.getAssignedTo().getFullName()
                        : null
        );

    }
    @GetMapping("/assigned")
    public ResponseEntity<List<IncidentResponse>> getAssignedIncidents(
            Authentication authentication) {

        User technician = getAuthenticatedUser(authentication);

        if (technician.getRole() != ma.enset.incidentmanagement.enums.Role.TECHNICIAN) {
            throw new AccessDeniedException(
                    "Only technicians can view assigned incidents");
        }

        List<IncidentResponse> incidents = incidentService
                .findByAssignedTo(technician)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(incidents);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentResponse> updateIncidentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateIncidentStatusRequest request,
            Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        Incident incident = incidentService.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Incident not found with id: " + id));

        if (incident.getStatus() == IncidentStatus.CLOSED) {
            throw new IllegalArgumentException(
                    "A closed incident cannot be modified");
        }

        if (currentUser.getRole() == Role.TECHNICIAN) {

            boolean isAssigned = incident.getAssignedTo() != null
                    && incident.getAssignedTo().getId()
                    .equals(currentUser.getId());

            if (!isAssigned) {
                throw new AccessDeniedException(
                        "You can only modify incidents assigned to you");
            }

        } else if (currentUser.getRole() != Role.ADMIN) {

            throw new AccessDeniedException(
                    "You are not allowed to modify this incident");
        }

        incident.setStatus(request.status());

        Incident updated = incidentService.save(incident);

        return ResponseEntity.ok(toResponse(updated));
    }

    @PutMapping("/{id}/assign/{technicianId}")
    public ResponseEntity<IncidentResponse> assignIncident(
            @PathVariable Long id,
            @PathVariable Long technicianId,
            Authentication authentication) {

        User admin = getAuthenticatedUser(authentication);

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException(
                    "Only administrators can assign incidents");
        }

        User technician = userService.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Technician not found with id: " + technicianId));

        Incident assigned = incidentService.assignIncident(id, technician);

        return ResponseEntity.ok(toResponse(assigned));
    }
}
