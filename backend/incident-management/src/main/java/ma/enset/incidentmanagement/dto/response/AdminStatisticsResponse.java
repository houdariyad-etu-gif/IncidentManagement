package ma.enset.incidentmanagement.dto.response;

public record AdminStatisticsResponse(
        long totalUsers,
        long enabledUsers,
        long disabledUsers,
        long totalIncidents,
        long openIncidents,
        long assignedIncidents,
        long inProgressIncidents,
        long resolvedIncidents,
        long closedIncidents
) {}