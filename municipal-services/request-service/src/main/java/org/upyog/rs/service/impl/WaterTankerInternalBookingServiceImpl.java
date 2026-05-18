package org.upyog.rs.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.contract.request.Role;
import org.springframework.stereotype.Service;
import org.upyog.rs.service.WaterTankerInternalBookingService;
import org.upyog.rs.service.WaterTankerService;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingRequest;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WaterTankerInternalBookingServiceImpl implements WaterTankerInternalBookingService {

    /**
     * Inject your existing water tanker service here.
     *
     * Replace WaterTankerService with the actual service class name
     * if your project uses a different name.
     */
    private final WaterTankerService waterTankerService;

    @Override
    public RequestInfo buildSystemRequestInfo(String tenantId) {

        RequestInfo requestInfo = new RequestInfo();

        requestInfo.setApiId("Rainmaker");
        requestInfo.setMsgId(System.currentTimeMillis() + "|en_IN");

        User user = new User();
        user.setId(103L);
        user.setUuid("5648ebaf-ed87-49f5-b026-637620ccab56");
        user.setUserName("system.scheduler");
        user.setName("System Scheduler");
        user.setMobileNumber("9999999999");
        user.setEmailId("system@djb.gov.in");
        user.setType("EMPLOYEE");
        user.setTenantId(tenantId);

        List<Role> roles = new ArrayList<>();

        Role systemRole = new Role();
        systemRole.setCode("SYSTEM");
        systemRole.setName("System user");
        systemRole.setTenantId(tenantId);
        roles.add(systemRole);

        Role wtRole = new Role();
        wtRole.setCode("WT_CEMP");
        wtRole.setName("Water Tanker Counter Employee");
        wtRole.setTenantId(tenantId);
        roles.add(wtRole);

        user.setRoles(roles);

        requestInfo.setUserInfo(user);

        return requestInfo;
    }

    @Override
    public void createBooking(WaterTankerBookingRequest request) {

        log.info("Calling internal WaterTankerService for fixed point booking creation");

        /*
         * IMPORTANT:
         * Replace this method name with your actual existing create method.
         *
         * Example possibilities:
         *
         * waterTankerService.createWaterTankerBooking(request);
         * waterTankerService.createBooking(request);
         * waterTankerService.create(request);
         */
        waterTankerService.createNewWaterTankerBookingRequest(request);
    }
}