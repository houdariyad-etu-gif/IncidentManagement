package ma.enset.incidentmanagement.service;

import ma.enset.incidentmanagement.entity.Incident;
import ma.enset.incidentmanagement.entity.User;

import java.util.List;
import java.util.Optional;

public interface IncidentService {

    // Retrieve an incident by its ID
    Optional<Incident> findById(Long id);

    // Retrieve all incidents created by an employee
    List<Incident> findByCreatedBy(User user);

    // Retrieve all incidents assigned to a technician
    List<Incident> findByAssignedTo(User technician);

    // Retrieve all incidents
    List<Incident> findAll();

    // Save a new incident or update an existing one
    Incident save(Incident incident);

    // Create a new incident for an employee
    Incident createIncident(Incident incident, User employee);

    // Assign an incident to a technician
    Incident assignIncident(Long incidentId, User technician);
}