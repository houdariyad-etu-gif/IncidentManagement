package ma.enset.incidentmanagement.dto.request;

import jakarta.validation.constraints.NotNull;
import ma.enset.incidentmanagement.enums.IncidentStatus;

public record UpdateIncidentStatusRequest(
        @NotNull(message = "Status is required")
        IncidentStatus status
) {}