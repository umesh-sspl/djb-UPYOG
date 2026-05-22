package org.upyog.rs.wt.scheduler.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.upyog.rs.web.models.ResponseInfo;

import java.util.List;

/**
 * Manual scheduler API response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FixedPointSchedulerRunResponse {

    private ResponseInfo responseInfo;

    private String tenantId;
    private String deliveryDate;
    private String dayOfWeek;

    private int totalScheduledRows;
    private int successCount;
    private int failedCount;

    private List<FillingPointSchedulerSummary> fillingPointSummaries;
}