package ma.enset.incidentmanagement.service.impl;

import ma.enset.incidentmanagement.entity.Incident;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.enums.IncidentStatus;
import ma.enset.incidentmanagement.repository.IncidentRepository;
import ma.enset.incidentmanagement.service.IncidentService;
import ma.enset.incidentmanagement.exception.ResourceNotFoundException;
import ma.enset.incidentmanagement.enums.Role;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentServiceImpl(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @Override
    public Optional<Incident> findById(Long id) {
        return incidentRepository.findById(id);
    }

    @Override
    public List<Incident> findByCreatedBy(User user) {
        return incidentRepository.findByCreatedBy(user);
    }

    @Override
    public List<Incident> findByAssignedTo(User technician) {
        return incidentRepository.findByAssignedTo(technician);
    }

    @Override
    public List<Incident> findAll() {
        return incidentRepository.findAll();
    }

    @Override
    public Incident save(Incident incident) {
        return incidentRepository.save(incident);
    }

    @Override
    public Incident createIncident(Incident incident, User employee) {

        // Associate the incident with its creator
        incident.setCreatedBy(employee);

        // Set the initial status
        incident.setStatus(IncidentStatus.OPEN);

        // No technician is assigned initially
        incident.setAssignedTo(null);

        return incidentRepository.save(incident);
    }

    @Override
    public Incident assignIncident(Long incidentId, User technician) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Incident not found with id: " + incidentId));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new IllegalArgumentException(
                    "Only a technician can be assigned to an incident");
        }

        if (incident.getStatus() == IncidentStatus.CLOSED) {
            throw new IllegalArgumentException(
                    "A closed incident cannot be assigned");
        }

        incident.setAssignedTo(technician);
        incident.setStatus(IncidentStatus.ASSIGNED);

        return incidentRepository.save(incident);
    }
}