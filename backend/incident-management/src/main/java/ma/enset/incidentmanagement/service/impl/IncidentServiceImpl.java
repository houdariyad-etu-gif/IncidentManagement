package ma.enset.incidentmanagement.service.impl;

import ma.enset.incidentmanagement.entity.Incident;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.repository.IncidentRepository;
import ma.enset.incidentmanagement.service.IncidentService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;

    // Constructor injection
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
}