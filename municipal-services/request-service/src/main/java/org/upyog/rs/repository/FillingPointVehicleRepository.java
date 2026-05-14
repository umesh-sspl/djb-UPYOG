package org.upyog.rs.repository;


import org.upyog.rs.wt.scheduler.model.VehicleDriverAssignmentData;

import java.util.List;

public interface FillingPointVehicleRepository {

    /**
     * Fetch only active vehicles mapped to filling point
     * where active driver is also mapped.
     */
    List<VehicleDriverAssignmentData> findActiveVehiclesWithMappedDriver(
            String tenantId,
            String fillingPointId
    );
}