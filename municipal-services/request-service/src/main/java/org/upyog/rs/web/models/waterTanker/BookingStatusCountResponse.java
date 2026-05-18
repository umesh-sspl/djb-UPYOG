package org.upyog.rs.web.models.waterTanker;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.upyog.rs.web.models.ResponseInfo;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingStatusCountResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    /**
     * Total count across all statuses (matching filters).
     */
    @JsonProperty("totalCount")
    private Integer totalCount;

    /**
     * Count broken down by booking_status.
     * e.g. { "SCHEDULED": 5, "IN_TRANSIT": 3, "DELIVERED": 12, ... }
     */
    @JsonProperty("statusCounts")
    private Map<String, Integer> statusCounts;

    /**
     * Application type filter that was applied ("watertanker", "watertanker-fixedpoint", or "ALL").
     */
    @JsonProperty("applicationType")
    private String applicationType;
}