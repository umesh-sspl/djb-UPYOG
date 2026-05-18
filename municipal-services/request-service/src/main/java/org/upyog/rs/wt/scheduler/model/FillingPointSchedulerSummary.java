package org.upyog.rs.wt.scheduler.model;


import lombok.Builder;
import lombok.Data;

/**
 * Filling-point-wise scheduler summary.
 */
@Data
@Builder
public class FillingPointSchedulerSummary {

    private String fillingPointId;

    private int scheduledRows;
    private int activeVehiclesWithDriver;

    private int successCount;
    private int failedCount;
}