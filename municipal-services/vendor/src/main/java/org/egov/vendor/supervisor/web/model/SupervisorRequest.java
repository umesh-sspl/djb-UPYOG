package org.egov.vendor.supervisor.web.model;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.vendor.service.RequestType;
import org.egov.vendor.util.VendorUtil;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupervisorRequest implements RequestType {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @Valid
    @JsonProperty("supervisor")
    private Supervisor supervisor;

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