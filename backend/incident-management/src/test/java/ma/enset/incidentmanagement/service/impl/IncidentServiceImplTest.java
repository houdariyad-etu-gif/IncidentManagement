package ma.enset.incidentmanagement.service.impl;

import ma.enset.incidentmanagement.entity.Incident;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.enums.IncidentStatus;
import ma.enset.incidentmanagement.repository.IncidentRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceImplTest {

    @Mock
    private IncidentRepository incidentRepository;

    @InjectMocks
    private IncidentServiceImpl incidentService;

    @Test
    void shouldFindIncidentById() {

        Long incidentId = 1L;

        Incident incident = new Incident();
        incident.setId(incidentId);

        when(incidentRepository.findById(incidentId))
                .thenReturn(Optional.of(incident));

        Optional<Incident> result =
                incidentService.findById(incidentId);

        assertTrue(result.isPresent());
        assertEquals(incidentId, result.get().getId());

        verify(incidentRepository).findById(incidentId);
    }

    @Test
    void shouldFindAllIncidents() {

        List<Incident> incidents = List.of(
                new Incident(),
                new Incident()
        );

        when(incidentRepository.findAll()).thenReturn(incidents);

        List<Incident> result = incidentService.findAll();

        assertEquals(2, result.size());

        verify(incidentRepository).findAll();
    }

    @Test
    void shouldSaveIncident() {

        Incident incident = new Incident();

        when(incidentRepository.save(incident))
                .thenReturn(incident);

        Incident result = incidentService.save(incident);

        assertNotNull(result);
        assertSame(incident, result);

        verify(incidentRepository).save(incident);
    }

    @Test
    void shouldFindIncidentsByCreator() {

        User employee = new User();

        List<Incident> incidents = List.of(new Incident());

        when(incidentRepository.findByCreatedBy(employee))
                .thenReturn(incidents);

        List<Incident> result =
                incidentService.findByCreatedBy(employee);

        assertEquals(1, result.size());

        verify(incidentRepository).findByCreatedBy(employee);
    }

    @Test
    void shouldFindIncidentsByTechnician() {

        User technician = new User();

        List<Incident> incidents = List.of(new Incident());

        when(incidentRepository.findByAssignedTo(technician))
                .thenReturn(incidents);

        List<Incident> result =
                incidentService.findByAssignedTo(technician);

        assertEquals(1, result.size());

        verify(incidentRepository).findByAssignedTo(technician);
    }

    @Test
    void shouldCreateIncidentWithCorrectInitialValues() {

        // Arrange
        User employee = new User();

        Incident incident = new Incident();
        incident.setTitle("Network problem");
        incident.setDescription("Internet connection unavailable");

        when(incidentRepository.save(incident))
                .thenReturn(incident);

        // Act
        Incident result =
                incidentService.createIncident(incident, employee);

        // Assert
        assertNotNull(result);
        assertSame(employee, result.getCreatedBy());
        assertEquals(IncidentStatus.OPEN, result.getStatus());
        assertNull(result.getAssignedTo());

        verify(incidentRepository).save(incident);
    }
}