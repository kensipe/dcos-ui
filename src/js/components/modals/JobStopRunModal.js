import { Trans, t } from "@lingui/macro";
import { i18nMark, withI18n } from "@lingui/react";
import { Confirm } from "reactjs-components";
import mixin from "reactjs-mixin";
import PropTypes from "prop-types";
import React from "react";
import { StoreMixin } from "mesosphere-shared-reactjs";

import MetronomeStore from "../../stores/MetronomeStore";
import ModalHeading from "../modals/ModalHeading";

const METHODS_TO_BIND = ["handleButtonConfirm"];

class JobStopRunModal extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: "metronome",
        events: ["jobStopRunSuccess", "jobStopRunError"],
        suppressUpdate: true
      }
    ];

    this.state = {
      pendingRequest: false
    };

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  handleButtonConfirm() {
    const { selectedItems, jobID } = this.props;
    // TODO DCOS-8763 introduce support for multiple job run IDs
    if (selectedItems.length === 1) {
      MetronomeStore.stopJobRun(jobID, selectedItems[0]);
    }

    this.setState({ pendingRequest: true });
  }

  onMetronomeStoreJobStopRunSuccess() {
    this.setState({ pendingRequest: false });
    this.props.onClose();
    this.props.onSuccess();
  }

  onMetronomeStoreJobStopRunError() {
    this.props.onClose();
  }

  getContentHeader(selectedItems, selectedItemsLength) {
    // L10NTODO: Pluralize
    const headerContent =
      selectedItemsLength === 1 ? (
        <Trans render="span">Are you sure you want to stop this?</Trans>
      ) : (
        <Trans render="span">
          Are you sure you want to stop {selectedItemsLength} Job Runs?
        </Trans>
      );

    return <ModalHeading key="confirmHeader">{headerContent}</ModalHeading>;
  }

  getConfirmTextBody(selectedItems, selectedItemsLength) {
    const bodyText =
      selectedItemsLength === 1
        ? i18nMark("You are about to stop the job run with id") +
          ` ${selectedItems[0]}.`
        : i18nMark("You are about to stop the selected job runs.");

    return <Trans render="span" id={bodyText} />;
  }

  getModalContents() {
    const { selectedItems } = this.props;
    const selectedItemsLength = selectedItems.length;

    return (
      <div className="text-align-center">
        {this.getConfirmTextBody(selectedItems, selectedItemsLength)}
      </div>
    );
  }

  render() {
    const { onClose, open, selectedItems, i18n } = this.props;
    // L10NTODO: Pluralize
    const rightButtonText =
      selectedItems.length > 1 ? "Stop Job Runs" : "Stop Job Run";

    const selectedItemsLength = selectedItems.length;

    return (
      <Confirm
        closeByBackdropClick={true}
        disabled={this.state.pendingRequest}
        header={this.getContentHeader(selectedItems, selectedItemsLength)}
        open={open}
        onClose={onClose}
        leftButtonText={i18n._(t`Cancel`)}
        leftButtonCallback={onClose}
        leftButtonClassName="button button-primary-link"
        rightButtonText={i18n._(rightButtonText)}
        rightButtonClassName="button button-danger"
        rightButtonCallback={this.handleButtonConfirm}
        showHeader={true}
      >
        {this.getModalContents()}
      </Confirm>
    );
  }
}

JobStopRunModal.defaultProps = {
  onSuccess() {}
};

JobStopRunModal.propTypes = {
  jobID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  selectedItems: PropTypes.array.isRequired
};

export default withI18n()(JobStopRunModal);
