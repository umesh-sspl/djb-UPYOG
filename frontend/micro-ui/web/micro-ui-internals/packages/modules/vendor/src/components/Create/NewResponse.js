import { Banner, Card, LinkButton, Loader, Row, StatusTable } from "@djb25/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { VendorData } from "../../../utils";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("ES_VENDOR_RESPONSE_CREATE_ACTION") : t("CS_AST_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("edit-application") ? t("CS_VENDOR_APPLICATION_PENDING") : t("CS_AST_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_VENDOR_APPLICATION_FAILED") : t("CS_AST_UPDATE_APPLICATION_FAILED");
  }
};

const rowContainerStyle = {
  padding: "4px 0px",
  justifyContent: "space-between",
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props)}
      applicationNumber={props.data?.VendorAdditionalDetails?.[0].registrationNo}
      info={props.isSuccess ? props.t("ES_VENDOR_RESPONSE_CREATE_LABEL") : ""}
      successful={props.isSuccess}
      style={{ width: "100%" }}
    />
  );
};

const NewResponse = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  const mutation = Digit.Hooks.vendor.useVendorAdditionaldetailsAPI(Digit.ULBService.getCurrentTenantId());

  useEffect(() => {
    try {
      data.tenantId = data.address?.city?.code;

      let formdata = VendorData(data);
      console.log("formdata in acknowejkfdlgi ::: ", formdata);
      mutation.mutate(formdata, {
        onSuccess,
      });

      console.log("mutation in acknowejkfdlgi ::: ", mutation);
    } catch (err) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleDownloadPdf = async () => {
  //   const { Asset = [] } = mutation.data;
  //   let AST = (Asset && Asset[0]) || {};
  //   const tenantInfo = tenants.find((tenant) => tenant.code === AST.tenantId);
  //   let tenantId = AST.tenantId || tenantId;

  //   const data = await getAssetAcknowledgementData({ ...AST }, tenantInfo, t);
  //   Digit.Utils.pdf.generate(data);
  // };

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card className="vehicle-details-card">
      <BannerPicker t={t} data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      <StatusTable>
        {mutation.isSuccess && <Row rowContainerStyle={rowContainerStyle} last textStyle={{ whiteSpace: "pre", width: "60%" }} />}
      </StatusTable>
      {/* {mutation.isSuccess && <SubmitBar label={t("AST_REPORT")} onSubmit={handleDownloadPdf} />} */}
      <Link to={`/digit-ui/employee`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default NewResponse;
