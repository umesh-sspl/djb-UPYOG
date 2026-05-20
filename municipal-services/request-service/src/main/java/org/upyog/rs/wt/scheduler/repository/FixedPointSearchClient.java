package org.upyog.rs.wt.scheduler.repository;

import digit.models.coremodels.RequestInfoWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.upyog.rs.web.models.waterTanker.WaterTankerFixedPointBookingSearchResponse;
import org.upyog.rs.web.models.waterTanker.WaterTankerFixedPointDetail;

import java.util.List;

/**
 * RestTemplate-based HTTP client for the Fixed Point Search API.
 *
 * Properties (application.properties):
 * ─────────────────────────────────────────────────────────────────────────────
 *   wt.fixedpoint.search.host = http://localhost:8091
 *   wt.fixedpoint.search.path = /request-service/water-tanker/fixed-point/v1/_search
 *   wt.resttemplate.connect-timeout-ms = 5000
 *   wt.resttemplate.read-timeout-ms    = 10000
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * URL built at runtime:
 *   POST http://localhost:8091/request-service/water-tanker/fixed-point/v1/_search
 *       ?tenantId=dl.djb&fixedPointId=FXP-05946
 *
 * Actual API response (verified):
 * {
 *   "waterTankerBookingDetail": [
 *     {
 *       "applicantDetail": { "applicantId": "...", "mobileNumber": "...", ... },
 *       "address":         { "addressId": "...", "city": "...", ... },
 *       "mobileNumber":    "9910005946"
 *     }
 *   ],
 *   "count": 1
 * }
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FixedPointSearchClient {

    /** Injected by RestTemplateConfig — has connect/read timeouts from properties */
    private final RestTemplate restTemplate;

    /**
     * wt.fixedpoint.search.host=http://localhost:8091
     */
    @Value("${wt.fixedpoint.search.host}")
    private String host;

    /**
     * wt.fixedpoint.search.path=/request-service/water-tanker/fixed-point/v1/_search
     */
    @Value("${wt.fixedpoint.search.path}")
    private String searchPath;

    /**
     * Searches fixed point by its human-readable code (e.g. FXP-05946).
     *
     * Calls:
     *   POST {wt.fixedpoint.search.host}{wt.fixedpoint.search.path}
     *       ?tenantId={tenantId}&fixedPointId={fixedPointCode}
     *
     * Returns the first WaterTankerFixedPointDetail from the response,
     * or null if not found / on any error.
     *
     * @param tenantId        e.g. "dl.djb"
     * @param fixedPointCode  e.g. "FXP-05946"
     */
    public WaterTankerFixedPointDetail searchByFixedPointCode(
            String tenantId,
            String fixedPointCode,
            RequestInfo requestInfo
    ) {

        if (!StringUtils.hasText(tenantId)) {
            log.warn("searchByFixedPointCode: tenantId is blank.");
            return null;
        }

        if (!StringUtils.hasText(fixedPointCode)) {
            log.warn("searchByFixedPointCode: fixedPointCode is blank.");
            return null;
        }

        try {

            String url = UriComponentsBuilder
                    .fromHttpUrl(host + searchPath)
                    .queryParam("tenantId", tenantId)
                    .queryParam("fixedPointId", fixedPointCode)
                    .toUriString();

            log.info("Fixed point search API call. url={}", url);

            // ─────────────────────────────────────────────
            // BUILD REQUEST BODY
            // {
            //   "RequestInfo": { ... }
            // }
            // ─────────────────────────────────────────────

            RequestInfoWrapper wrapper = new RequestInfoWrapper();
            wrapper.setRequestInfo(requestInfo);

            HttpEntity<RequestInfoWrapper> entity =
                    new HttpEntity<>(wrapper, buildHeaders());

            // ─────────────────────────────────────────────
            // API CALL
            // ─────────────────────────────────────────────

            ResponseEntity<WaterTankerFixedPointBookingSearchResponse> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            WaterTankerFixedPointBookingSearchResponse.class
                    );

            // ─────────────────────────────────────────────
            // VALIDATE RESPONSE
            // ─────────────────────────────────────────────

            if (response.getStatusCode() != HttpStatus.OK) {

                log.warn(
                        "Fixed point search API non-200. status={}, fixedPointCode={}",
                        response.getStatusCode(),
                        fixedPointCode
                );

                return null;
            }

            WaterTankerFixedPointBookingSearchResponse body = response.getBody();

            if (body == null) {

                log.warn(
                        "Fixed point search API returned null body. fixedPointCode={}",
                        fixedPointCode
                );

                return null;
            }

            List<WaterTankerFixedPointDetail> list =
                    body.getWaterTankerFixedPointDetails();

            if (list == null || list.isEmpty()) {

                log.warn(
                        "Fixed point search API returned empty list. fixedPointCode={}",
                        fixedPointCode
                );

                return null;
            }

            WaterTankerFixedPointDetail result = list.get(0);

            log.info(
                    "Fixed point found. fixedPointCode={}, applicantId={}, addressId={}",
                    fixedPointCode,
                    result.getApplicantDetail() != null
                            ? result.getApplicantDetail().getApplicantId()
                            : "null",
                    result.getAddress() != null
                            ? result.getAddress().getAddressId()
                            : "null"
            );

            return result;

        } catch (HttpClientErrorException e) {

            log.error(
                    "Fixed point search API 4xx error. fixedPointCode={}, status={}, body={}",
                    fixedPointCode,
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

        } catch (HttpServerErrorException e) {

            log.error(
                    "Fixed point search API 5xx error. fixedPointCode={}, status={}, body={}",
                    fixedPointCode,
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

        } catch (ResourceAccessException e) {

            log.error(
                    "Fixed point search API connection failed. fixedPointCode={}, error={}",
                    fixedPointCode,
                    e.getMessage()
            );

        } catch (Exception e) {

            log.error(
                    "Fixed point search API unexpected error. fixedPointCode={}",
                    fixedPointCode,
                    e
            );
        }

        return null;
    }
    /**
     * Internal service-to-service headers.
     * No auth token needed since both services share the same internal network.
     * If your API gateway requires a Bearer token, inject it here.
     */
    private HttpHeaders buildHeaders() {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.setAccept(
                List.of(MediaType.APPLICATION_JSON)
        );

        return headers;
    }
}