
package ma.enset.incidentmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import ma.enset.incidentmanagement.enums.IncidentCategory;
import ma.enset.incidentmanagement.enums.IncidentPriority;

public record CreateIncidentRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title must not exceed 150 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must not exceed 2000 characters")
        String description,

        @NotNull(message = "Category is required")
        IncidentCategory category,

        @NotNull(message = "Priority is required")
        IncidentPriority priority

) {}
