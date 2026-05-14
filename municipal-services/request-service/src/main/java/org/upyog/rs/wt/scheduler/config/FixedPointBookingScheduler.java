package org.upyog.rs.wt.scheduler.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.upyog.rs.wt.scheduler.service.FixedPointBookingSchedulerService;

import java.time.LocalDate;

/**
 * Auto scheduler trigger.
 *
 * Runs daily at 12:10 AM.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FixedPointBookingScheduler {

    private final FixedPointBookingSchedulerService schedulerService;

    @Value("${wt.fixedpoint.scheduler.enabled:true}")
    private Boolean schedulerEnabled;

    @Value("${wt.fixedpoint.tenant-id}")
    private String tenantId;

    @Scheduled(cron = "${wt.fixedpoint.scheduler.cron}")
    public void runFixedPointBookingScheduler() {

        log.info("========== Fixed Point Booking Scheduler Started ==========");

        if (!Boolean.TRUE.equals(schedulerEnabled)) {
            log.warn("Fixed Point Booking Scheduler is disabled");
            return;
        }

        try {
            schedulerService.runScheduler(
                    tenantId,
                    LocalDate.now(),
                    null,
                    null
            );

            log.info("========== Fixed Point Booking Scheduler Completed ==========");

        } catch (Exception e) {
            log.error("Fixed Point Booking Scheduler failed", e);
        }
    }
}