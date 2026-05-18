import { LabelFieldPair, Dropdown, TextInput, CardLabelError, CardLabel, CollapsibleCardPage } from "@djb25/digit-ui-react-components";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";

const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;

const RwhPropertyWaterConnection = ({ t, config, onSelect, formData, formState, setError, clearErrors }) => {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      propertyCategory: null,
      propertyType: null,
      usageType: null,
      yearOfConstruction: null,
      plotArea: "",
      roofTopArea: "",
      ...(formData?.[config.key] || {}),
    },
  });

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { isLoading: isMastersLoading, data: ptMastersData } = Digit.Hooks.pt.usePropertyMDMS(tenantId, "PropertyTax", [
    "PropertyCategory",
    "PropertyType",
    "PropertyNewUsageType",
  ]);

  const formValue = watch();

  const lastSentValue = React.useRef(null);
  useEffect(() => {
    if (!_.isEqual(lastSentValue.current, formValue)) {
      lastSentValue.current = _.cloneDeep(formValue);
      onSelect(config.key, formValue);
    }
  }, [formValue, config.key, onSelect]);

  const categoryOptions = useMemo(() => {
    return ptMastersData?.PropertyTax?.PropertyCategory?.filter((item) => item.active).map((item) => ({
      code: item.code,
      name: item.name,
    })) || [];
  }, [ptMastersData]);

  const propertyTypeOptions = useMemo(() => {
    return ptMastersData?.PropertyTax?.PropertyType?.filter((item) => item.active).map((item) => ({
      code: item.code,
      name: item.name,
    })) || [];
  }, [ptMastersData]);

  const usageTypeOptions = useMemo(() => {
    return ptMastersData?.PropertyTax?.PropertyNewUsageType?.filter((item) => item.active).map((item) => ({
      code: item.code,
      name: item.name,
    })) || [];
  }, [ptMastersData]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push({ value: i.toString(), name: i.toString() });
    }
    return years;
  }, []);

  const errorStyle = { color: "red", fontSize: "12px", marginTop: "-10px", marginBottom: "10px" };

  return (
    <CollapsibleCardPage title={t("RWH_PROPERTY_AND_WATER_CONNECTION_USE_DETAILS")} defaultOpen={true}>
      <div className="formcomposer-section-grid">
        <LabelFieldPair>
          <CardLabel>{`${t("RWH_PROPERTY_CATEGORY")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="propertyCategory"
              defaultValue={getValues("propertyCategory") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => (
                <Dropdown
                  option={categoryOptions}
                  optionKey="name"
                  selected={props.value}
                  select={props.onChange}
                  t={t}
                />
              )}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_PROPERTY_TYPE")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="propertyType"
              defaultValue={getValues("propertyType") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => (
                <Dropdown
                  option={propertyTypeOptions}
                  optionKey="name"
                  selected={props.value}
                  select={props.onChange}
                  t={t}
                />
              )}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_USAGE_TYPE")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="usageType"
              defaultValue={getValues("usageType") || null}
              rules={{ required: t("REQUIRED_FIELD") }}
              render={(props) => (
                <Dropdown
                  option={usageTypeOptions}
                  optionKey="name"
                  selected={props.value}
                  select={props.onChange}
                  t={t}
                />
              )}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{t("RWH_SELECT_YEAR_OF_CONSTRUCTION")}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="yearOfConstruction"
              defaultValue={getValues("yearOfConstruction") || null}
              render={(props) => (
                <Dropdown
                  option={yearOptions}
                  optionKey="name"
                  selected={props.value}
                  select={props.onChange}
                  t={t}
                  placeholder={t("RWH_SELECT_YEAR")}
                />
              )}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_PLOT_AREA")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="plotArea"
              defaultValue={getValues("plotArea") || ""}
              rules={{ required: t("REQUIRED_FIELD"), pattern: DECIMAL_PATTERN }}
              render={(props) => (
                <TextInput
                  value={props.value}
                  onChange={(e) => props.onChange(e.target.value)}
                  placeholder={t("RWH_PLOT_AREA_SQ_M")}
                />
              )}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_ROOF_TOP_AREA_IN_SQ_M")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="roofTopArea"
              defaultValue={getValues("roofTopArea") || ""}
              rules={{ required: t("REQUIRED_FIELD"), pattern: DECIMAL_PATTERN }}
              render={(props) => (
                <TextInput
                  value={props.value}
                  onChange={(e) => props.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </LabelFieldPair>
      </div>
    </CollapsibleCardPage>
  );
};

export default RwhPropertyWaterConnection;
