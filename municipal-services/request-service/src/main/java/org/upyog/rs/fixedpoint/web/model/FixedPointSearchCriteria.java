package org.upyog.rs.fixedpoint.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixedPointSearchCriteria {
    private String tenantId;
    private String scheduleId;
    private String fixedPointCode;
    @JsonProperty("fillingPointId")
    private String fillingPointId;
    private String day;
    private String vehicleId;


    @JsonProperty("isEnable")
    private Boolean isEnable;
    private Integer offset;
    private Integer limit;
    private boolean isCountCall;
}
