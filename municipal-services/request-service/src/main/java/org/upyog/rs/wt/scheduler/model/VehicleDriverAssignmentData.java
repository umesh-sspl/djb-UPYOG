package org.upyog.rs.wt.scheduler.model;


import lombok.Data;

/**
 * Vehicle + driver data available for assignment.
 *
 * Only vehicles having active mapped driver should be loaded here.
 */
@Data
public class VehicleDriverAssignmentData {

    private String fillingPointId;

    private String vendorId;
    private String vehicleId;
    private String driverId;

    private String vehicleType;
    private String vehicleCapacity;

    /**
     * Runtime count maintained only during scheduler execution.
     */
    private int assignedCount;
}