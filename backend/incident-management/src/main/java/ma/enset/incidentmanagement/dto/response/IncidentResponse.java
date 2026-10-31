
package ma.enset.incidentmanagement.dto.response;

import ma.enset.incidentmanagement.enums.IncidentCategory;
import ma.enset.incidentmanagement.enums.IncidentPriority;
import ma.enset.incidentmanagement.enums.IncidentStatus;

import java.time.LocalDateTime;

public record IncidentResponse(
        Long id,
        String title,
        String description,
        IncidentCategory category,
        IncidentPriority priority,
        IncidentStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String createdBy,
        String assignedTo
) {}
