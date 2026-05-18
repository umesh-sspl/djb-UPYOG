import React, { useState, useEffect } from "react";
import {
  LabelFieldPair,
  CardLabel,
  TextInput,
  Dropdown,
  MobileNumber,
  CardLabelError,
  CollapsibleCardPage,
  RadioButtons,
  CheckBox,
  UploadFile,
} from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";

const RwhCustomerDetailsComponent = ({ t, config, onSelect, formData, userType }) => {
  const {
    control,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      jurisdiction: null,
      pid: "",
      kNo: "",
      applicationType: null,
      connectionCategory: { i18nKey: "RWH_DOMESTIC", code: "DOMESTIC", name: "Domestic" },
      domesticType: { i18nKey: "RWH_INDIVIDUAL", code: "INDIVIDUAL", name: "Individual" },
      firstName: "",
      middleName: "",
      lastName: "",
      gender: null,
      parentSpouse: "",
      mobileNumber: "",
      isWhatsAppSameAsMobile: false,
      whatsAppNumber: "",
      email: "",
      departmentType: { i18nKey: "RWH_DEPARTMENT_TYPE_GOVERNMENT", code: "GOVERNMENT", name: "Government" },
      institutionName: "",
      natureOfWork: "",
      orgDeptDocument: null,
      ...(formData?.[config.key] || {}),
    },
  });

  const formValue = watch();
  const watchJurisdiction = watch("jurisdiction");
  const watchDomesticType = watch("domesticType");
  const watchIsWhatsAppSameAsMobile = watch("isWhatsAppSameAsMobile");
  const watchMobileNumber = watch("mobileNumber");

  useEffect(() => {
    if (watchIsWhatsAppSameAsMobile) {
      setValue("whatsAppNumber", watchMobileNumber);
    }
  }, [watchIsWhatsAppSameAsMobile, watchMobileNumber, setValue]);

  const lastSentValue = React.useRef(null);
  useEffect(() => {
    if (!_.isEqual(lastSentValue.current, formValue)) {
      lastSentValue.current = _.cloneDeep(formValue);
      onSelect(config.key, formValue);
    }
  }, [formValue, config.key, onSelect]);

  const jurisdictionOptions = [
    { i18nKey: "RWH_JURISDICTION_DELHI_CANTT", code: "DELHI_CANTT", name: "Delhi Cantt." },
    { i18nKey: "RWH_JURISDICTION_DJB", code: "DJB", name: "DJB" },
    { i18nKey: "RWH_JURISDICTION_NDMC", code: "NDMC", name: "NDMC" },
  ];

  const applicationTypeOptions = [{ i18nKey: "RWH_APP_TYPE_NEW", code: "NEW", name: "New Connection" }];

  const connectionCategoryOptions = [
    { i18nKey: "RWH_DOMESTIC", code: "DOMESTIC", name: "Domestic" },
    { i18nKey: "RWH_NON_DOMESTIC", code: "NON_DOMESTIC", name: "Non-Domestic" },
  ];

  const domesticTypeOptions = [
    { i18nKey: "RWH_INDIVIDUAL", code: "INDIVIDUAL", name: "Individual" },
    { i18nKey: "RWH_ORGANIZATION", code: "ORGANIZATION", name: "Organization" },
  ];

  const genderOptions = [
    { i18nKey: "COMMON_GENDER_MALE", code: "MALE", name: "Male" },
    { i18nKey: "COMMON_GENDER_FEMALE", code: "FEMALE", name: "Female" },
    { i18nKey: "COMMON_GENDER_TRANSGENDER", code: "TRANSGENDER", name: "Transgender" },
  ];

  const errorStyle = { color: "red", fontSize: "12px", marginTop: "-10px", marginBottom: "10px" };

  return (
    <CollapsibleCardPage title={t("RWH_CUSTOMER_DETAILS")} defaultOpen={true}>
      <div className="formcomposer-section-grid">
        <LabelFieldPair>
          <CardLabel>{`${t("RWH_JURISDICTION")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="jurisdiction"
              defaultValue={getValues("jurisdiction") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => <Dropdown option={jurisdictionOptions} optionKey="name" selected={props.value} select={props.onChange} t={t} />}
            />
          </div>
        </LabelFieldPair>

        {watchJurisdiction && (
          <LabelFieldPair>
            <CardLabel>{watchJurisdiction?.code === "DJB" ? t("RWH_K_NO_OPTIONAL") : t("RWH_PID")}</CardLabel>
            <div className="field">
              {watchJurisdiction?.code === "DJB" ? (
                <Controller
                  control={control}
                  name="kNo"
                  key="kNo"
                  defaultValue={getValues("kNo") || ""}
                  render={(props) => (
                    <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} placeholder={t("RWH_ENTER_K_NUMBER")} />
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name="pid"
                  key="pid"
                  defaultValue={getValues("pid") || ""}
                  render={(props) => (
                    <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} placeholder={t("RWH_ENTER_PID_NUMBER")} />
                  )}
                />
              )}
            </div>
          </LabelFieldPair>
        )}

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_APPLICATION_TYPE")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="applicationType"
              defaultValue={getValues("applicationType") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => <Dropdown option={applicationTypeOptions} optionKey="name" selected={props.value} select={props.onChange} t={t} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_CONNECTION_CATEGORY")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="connectionCategory"
              defaultValue={getValues("connectionCategory") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => (
                <Dropdown option={connectionCategoryOptions} optionKey="name" selected={props.value} select={props.onChange} t={t} />
              )}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_DOMESTIC_TYPE")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="domesticType"
              defaultValue={getValues("domesticType") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => (
                <RadioButtons options={domesticTypeOptions} optionsKey="name" selectedOption={props.value} onSelect={props.onChange} t={t} />
              )}
            />
          </div>
        </LabelFieldPair>

        {watchDomesticType?.code === "ORGANIZATION" && (
          <React.Fragment>
            <LabelFieldPair>
              <CardLabel>{`${t("RWH_DEPARTMENT_TYPE")}*`}</CardLabel>
              <div className="field">
                <Controller
                  control={control}
                  name="departmentType"
                  defaultValue={getValues("departmentType") || null}
                  rules={{ required: t("REQUIRED_FIELD") }}
                  render={(props) => (
                    <RadioButtons
                      options={[
                        { i18nKey: "RWH_DEPARTMENT_TYPE_GOVERNMENT", code: "GOVERNMENT", name: "Government" },
                        { i18nKey: "RWH_DEPARTMENT_TYPE_NON_GOVERNMENT", code: "NON_GOVERNMENT", name: "Non-Government" },
                      ]}
                      optionsKey="name"
                      selectedOption={props.value}
                      onSelect={props.onChange}
                      t={t}
                    />
                  )}
                />
              </div>
            </LabelFieldPair>

            <div style={{ color: "#3257F2", gridColumn: "span 2" }}>{t("RWH_DEPARTMENT_ORGANIZATION_DETAILS")}</div>

            <LabelFieldPair>
              <CardLabel>{`${t("RWH_ORGANIZATION_DEPARTMENT_NAME")}*`}</CardLabel>
              <div className="field">
                <Controller
                  control={control}
                  name="institutionName"
                  defaultValue={getValues("institutionName") || ""}
                  rules={{ required: t("REQUIRED_FIELD") }}
                  render={(props) => (
                    <TextInput
                      value={props.value}
                      onChange={(e) => props.onChange(e.target.value)}
                      placeholder={t("RWH_ORGANIZATION_DEPARTMENT_NAME_PLACEHOLDER")}
                    />
                  )}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair>
              <CardLabel>{`${t("RWH_NATURE_OF_WORK")}*`}</CardLabel>
              <div className="field">
                <Controller
                  control={control}
                  name="natureOfWork"
                  defaultValue={getValues("natureOfWork") || ""}
                  rules={{ required: t("REQUIRED_FIELD") }}
                  render={(props) => (
                    <TextInput
                      value={props.value}
                      onChange={(e) => props.onChange(e.target.value)}
                      placeholder={t("RWH_NATURE_OF_WORK_PLACEHOLDER")}
                    />
                  )}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair>
              <CardLabel>{`${t("RWH_ORG_DEPT_DOCUMENT")}*`}</CardLabel>
              <div className="field">
                <Controller
                  control={control}
                  name="orgDeptDocument"
                  defaultValue={getValues("orgDeptDocument") || null}
                  rules={{ required: t("REQUIRED_FIELD") }}
                  render={(props) => (
                    <UploadFile
                      id={"orgDeptDocument"}
                      onUpload={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          Digit.UploadServices.Filestorage("RWH", file, Digit.ULBService.getStateId()).then((res) => {
                            if (res?.data?.files?.length > 0) {
                              props.onChange(res?.data?.files[0]?.fileStoreId);
                            }
                          });
                        }
                      }}
                      onDelete={() => props.onChange(null)}
                      message={props.value ? `1 ${t("RWH_ACTION_FILEUPLOADED")}` : t("RWH_ACTION_NO_FILEUPLOADED")}
                      accept="image/*, .pdf"
                    />
                  )}
                />
              </div>
            </LabelFieldPair>
          </React.Fragment>
        )}

        <div style={{ gridColumn: "span 2", height: "1px", background: "#efefef", margin: "16px 0" }}></div>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_FIRST_NAME")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="firstName"
              defaultValue={getValues("firstName") || ""}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{t("RWH_MIDDLE_NAME")}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="middleName"
              defaultValue={getValues("middleName") || ""}
              render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_LAST_NAME")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="lastName"
              defaultValue={getValues("lastName") || ""}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_GENDER")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="gender"
              defaultValue={getValues("gender") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => <Dropdown option={genderOptions} optionKey="name" selected={props.value} select={props.onChange} t={t} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_PARENT_SPOUSE")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="parentSpouse"
              defaultValue={getValues("parentSpouse") || ""}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("CORE_COMMON_MOBILE_NUMBER")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="mobileNumber"
              defaultValue={getValues("mobileNumber") || ""}
              rules={{ required: t("REQUIRED_FIELD"), pattern: /^[6-9]\d{9}$/ }}
              render={(props) => <MobileNumber value={props.value} onChange={props.onChange} onBlur={props.onBlur} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <div className="field" style={{ width: "100%" }}>
            <CheckBox
              label={t("RWH_SAME_AS_ABOVE_MOBILE_NO")}
              onChange={(e) => setValue("isWhatsAppSameAsMobile", e.target.checked)}
              checked={watchIsWhatsAppSameAsMobile}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{t("RWH_EMAIL")}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="email"
              defaultValue={getValues("email") || ""}
              render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{t("RWH_WHATSAPP_NUMBER")}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="whatsAppNumber"
              defaultValue={getValues("whatsAppNumber") || ""}
              render={(props) => <MobileNumber value={props.value} onChange={props.onChange} disable={watchIsWhatsAppSameAsMobile} />}
            />
          </div>
        </LabelFieldPair>
      </div>
    </CollapsibleCardPage>
  );
};

export default RwhCustomerDetailsComponent;
