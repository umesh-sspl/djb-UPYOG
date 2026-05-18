package org.upyog.rs.wt.scheduler.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.egov.common.contract.request.RequestInfo;

import java.time.LocalDate;

/**
 * Manual scheduler API request.
 *
 * Used when auto scheduler fails or admin wants to run manually.
 */
@Data
public class FixedPointSchedulerRunRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    private String tenantId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deliveryDate;

    /**
     * Optional.
     * If passed, run scheduler only for this filling point.
     * If blank/null, run for all filling points.
     */
    private String fillingPointId;

    /**
     * Reserved for future.
     * Current duplicate handling is DB-level.
     */
    private Boolean forceRun;
}