import React from "react";
import { CardLabel, Dropdown, LabelFieldPair } from "@djb25/digit-ui-react-components";

const SelectEkycDropdown = ({ config, onSelect, t, formData }) => {
  const options = config?.populators?.options || [];
  const optionsKey = config?.populators?.optionsKey || "name";
  const selected = formData?.[config.key];

  const handleSelect = (value) => {
    onSelect(config.key, value);
  };

  return (
    <LabelFieldPair>
      <CardLabel>{t(config.label)}</CardLabel>
      <div className="field">
        <Dropdown
          selected={selected}
          option={options}
          select={handleSelect}
          optionKey={optionsKey}
          t={t}
        />
      </div>
    </LabelFieldPair>
  );
};

export default SelectEkycDropdown;
