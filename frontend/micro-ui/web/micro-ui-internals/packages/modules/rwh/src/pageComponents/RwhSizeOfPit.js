import { LabelFieldPair, Dropdown, TextInput, CardLabel, CollapsibleCardPage } from "@djb25/digit-ui-react-components";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";

const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;

const RwhSizeOfPit = ({ t, config, onSelect, formData }) => {
  const { control, watch, setValue, getValues } = useForm({
    defaultValues: {
      typeOfPit: { i18nKey: "RWH_PIT_TYPE_RECTANGULAR", code: "RECTANGULAR", name: "Rectangular" },
      length: "",
      breadth: "",
      dia: "",
      effectiveDepth: "",
      retentionCapacity: "",
      ...(formData?.[config.key] || {}),
    },
  });

  const formValue = watch();
  const { typeOfPit, length, breadth, dia, effectiveDepth } = formValue;

  useEffect(() => {
    let capacity = 0;
    if (typeOfPit?.code === "RECTANGULAR") {
      const L = parseFloat(length) || 0;
      const B = parseFloat(breadth) || 0;
      const H = parseFloat(effectiveDepth) || 0;
      capacity = L * B * H;
    } else if (typeOfPit?.code === "CIRCULAR") {
      const D = parseFloat(dia) || 0;
      const H = parseFloat(effectiveDepth) || 0;
      capacity = Math.PI * Math.pow(D / 2, 2) * H;
    }
    const formattedCapacity = capacity > 0 ? capacity.toFixed(2) : "";
    if (getValues("retentionCapacity") !== formattedCapacity) {
      setValue("retentionCapacity", formattedCapacity);
    }
  }, [typeOfPit, length, breadth, dia, effectiveDepth, setValue, getValues]);

  const lastSentValue = React.useRef(null);
  useEffect(() => {
    if (!_.isEqual(lastSentValue.current, formValue)) {
      lastSentValue.current = _.cloneDeep(formValue);
      onSelect(config.key, formValue);
    }
  }, [formValue, config.key, onSelect]);

  const pitTypeOptions = [
    { i18nKey: "RWH_PIT_TYPE_RECTANGULAR", code: "RECTANGULAR", name: "Rectangular" },
    { i18nKey: "RWH_PIT_TYPE_CIRCULAR", code: "CIRCULAR", name: "Circular" },
  ];

  return (
    <CollapsibleCardPage title={t("RWH_SIZE_OF_PIT")} defaultOpen={true}>
      <div className="formcomposer-section-grid">
        <LabelFieldPair>
          <CardLabel>{`${t("RWH_TYPE_OF_PIT")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="typeOfPit"
              defaultValue={getValues("typeOfPit") || null}
              render={(props) => <Dropdown option={pitTypeOptions} optionKey="name" selected={props.value} select={props.onChange} t={t} />}
            />
          </div>
        </LabelFieldPair>

        {typeOfPit?.code === "RECTANGULAR" ? (
          <React.Fragment key="rectangular-fields">
            <LabelFieldPair>
              <CardLabel>{`${t("RWH_LENGTH_IN_M")}*`}</CardLabel>
              <div className="field">
                <Controller
                  control={control}
                  name="length"
                  defaultValue={getValues("length") || ""}
                  rules={{ required: true, pattern: DECIMAL_PATTERN }}
                  render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair>
              <CardLabel>{`${t("RWH_BREADTH_IN_M")}*`}</CardLabel>
              <div className="field">
                <Controller
                  control={control}
                  name="breadth"
                  defaultValue={getValues("breadth") || ""}
                  rules={{ required: true, pattern: DECIMAL_PATTERN }}
                  render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
                />
              </div>
            </LabelFieldPair>
          </React.Fragment>
        ) : (
          <LabelFieldPair key="circular-fields">
            <CardLabel>{`${t("RWH_DIA_IN_M")}*`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name="dia"
                defaultValue={getValues("dia") || ""}
                rules={{ required: true, pattern: DECIMAL_PATTERN }}
                render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
              />
            </div>
          </LabelFieldPair>
        )}

        <LabelFieldPair>
          <CardLabel>{`${t("RWH_EFFECTIVE_DEPTH_IN_M")}*`}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="effectiveDepth"
              defaultValue={getValues("effectiveDepth") || ""}
              rules={{ required: true, pattern: DECIMAL_PATTERN }}
              render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel>{t("RWH_RETENTION_CAPACITY_IN_CUM")}</CardLabel>
          <div className="field">
            <Controller
              control={control}
              name="retentionCapacity"
              defaultValue={getValues("retentionCapacity") || ""}
              render={(props) => <TextInput value={props.value} onChange={(e) => props.onChange(e.target.value)} />}
            />
          </div>
        </LabelFieldPair>
      </div>
    </CollapsibleCardPage>
  );
};

export default RwhSizeOfPit;
