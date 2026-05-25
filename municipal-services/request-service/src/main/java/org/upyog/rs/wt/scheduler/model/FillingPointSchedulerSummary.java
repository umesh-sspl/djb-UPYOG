package org.upyog.rs.wt.scheduler.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Filling-point-wise scheduler summary.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FillingPointSchedulerSummary {

    private String fillingPointId;

    private int scheduledRows;
    private int activeVehiclesWithDriver;

    private int successCount;
    private int failedCount;
}