import { formatResource } from "#SRC/js/utils/Units";
import Util from "#SRC/js/utils/Util";

import { getDisplayValue } from "../utils/ServiceConfigDisplayUtil";
import ServiceConfigBaseSectionDisplay from "./ServiceConfigBaseSectionDisplay";

class ServiceStorageConfigSection extends ServiceConfigBaseSectionDisplay {
  /**
   * @override
   */
  shouldExcludeItem() {
    const { appConfig } = this.props;

    return !Util.findNestedPropertyInObject(
      appConfig,
      "container.volumes.length"
    );
  }

  /**
   * @override
   */
  getMountType() {
    return "CreateService:ServiceConfigDisplay:App:Storage";
  }

  getVolumeSizeValue(value, type = null) {
    if (value == null) {
      return getDisplayValue(value);
    }

    if (type === "EXTERNAL") {
      // External volumes specify size in GiB
      value = value * 1024;
    }

    return formatResource("disk", value);
  }

  /**
   * @override
   */
  getDefinition() {
    const { appConfig } = this.props;

    if (appConfig.container.volumes == null) {
      return null;
    }

    const volumes = appConfig.container.volumes;
    const config = {
      tabViewID: "volumes",
      values: [
        {
          heading: "Volumes",
          headingLevel: 1
        }
      ]
    };

    volumes.forEach((volume, index) => {
      const configHeading = {
        heading: null,
        headingLevel: 2
      };
      const configName = {
        key: null,
        label: "NAME"
      };
      const configContainerPath = {
        key: null,
        label: "CONTAINER PATH"
      };
      const configSize = {
        key: null,
        label: "SIZE",
        transformValue: null
      };

      if (volume.persistent != null && volume.persistent.profileName != null) {
        // DSS
        configHeading.heading = "DC/OS Storage Service";
        configName.key = `container.volumes.${index}.persistent.profileName`;
        configName.name = "PROFILE NAME";
        configContainerPath.key = `container.volumes.${index}.containerPath`;
        configSize.key = `container.volumes.${index}.persistent.size`;
        configSize.transformValue = this.getVolumeSizeValue;

        config.values.push(
          configHeading,
          configName,
          configContainerPath,
          configSize
        );
      } else if (volume.persistent != null) {
        // Local Persistent
        configHeading.heading = "Local Persistent Volume";
        configName.key = null;
        configName.name = null;
        configContainerPath.key = `container.volumes.${index}.containerPath`;
        configSize.key = `container.volumes.${index}.persistent.size`;
        configSize.transformValue = this.getVolumeSizeValue;

        config.values.push(configHeading, configContainerPath, configSize);
      } else if (volume.external != null) {
        // External
        configHeading.heading = "External Persistent Volume";
        configName.key = `container.volumes.${index}.external.name`;
        configContainerPath.key = `container.volumes.${index}.containerPath`;
        configSize.key = `container.volumes.${index}.external.size`;
        configSize.transformValue = value => {
          this.getVolumeSizeValue(value, "EXTERNAL");
        };

        config.values.push(
          configHeading,
          configName,
          configContainerPath,
          configSize
        );
      } else {
        // host
        configHeading.heading = "Host Volume";
        configName.key = null;
        configName.name = null;
        configContainerPath.key = `container.volumes.${index}.containerPath`;
        configSize.key = null;
        configSize.transformValue = null;

        config.values.push(configHeading, configContainerPath);
      }
    });

    return config;
  }
}

module.exports = ServiceStorageConfigSection;
