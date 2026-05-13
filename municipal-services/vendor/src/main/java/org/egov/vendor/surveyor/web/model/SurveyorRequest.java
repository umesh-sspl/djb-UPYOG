// ── SurveyorRequest.java ──────────────────────────────────────────────────────
package org.egov.vendor.surveyor.web.model;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.vendor.service.RequestType;
import org.egov.vendor.util.VendorUtil;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Validated
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class SurveyorRequest implements RequestType {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo = null;

    @Valid
    @JsonProperty("surveyor")
    private Surveyor surveyor = null;

    @Override
    public RequestInfo getRequestInfo() {
        return requestInfo;
    }

    @Override
    public String getTenantId() {
        return VendorUtil.extractTenantId(this);
    }

    @Override
    public String getModuleNameOrDefault(VendorUtil vendorUtil) {
        return vendorUtil.getModuleNameOrDefault(this);
    }
}