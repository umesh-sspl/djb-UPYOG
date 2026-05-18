package org.upyog.rs.wt.scheduler.model;


import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Manual scheduler API response.
 */
@Data
@Builder
public class FixedPointSchedulerRunResponse {

    private String tenantId;
    private String deliveryDate;
    private String dayOfWeek;

    private int totalScheduledRows;
    private int successCount;
    private int failedCount;

    private List<FillingPointSchedulerSummary> fillingPointSummaries;
}