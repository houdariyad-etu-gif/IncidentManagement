
package ma.enset.incidentmanagement.repository;

import ma.enset.incidentmanagement.entity.Incident;
import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByCreatedBy(User user);

    List<Incident> findByAssignedTo(User technician);

    List<Incident> findByStatus(IncidentStatus status);

    long countByStatus(ma.enset.incidentmanagement.enums.IncidentStatus status);
}
