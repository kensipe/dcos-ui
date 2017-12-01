import { FormattedMessage } from "react-intl";
import { Link } from "react-router";
import React, { PropTypes } from "react";

import AlertPanel from "#SRC/js/components/AlertPanel";
import AlertPanelHeader from "#SRC/js/components/AlertPanelHeader";

const ServiceItemNotFound = function({ message }) {
  const footer = (
    <div className="button-collection flush-bottom">
      <Link to="/services" className="button button-stroke">
        <FormattedMessage id="XXXX" defaultMessage={`View Services`} />
      </Link>
    </div>
  );

  return (
    <AlertPanel>
      <AlertPanelHeader>
        <FormattedMessage id="XXXX" defaultMessage={`Service not found`} />
      </AlertPanelHeader>
      <p className="tall">
        {message}
      </p>
      {footer}
    </AlertPanel>
  );
};

ServiceItemNotFound.defaultProps = {
  message: "Not Found."
};

ServiceItemNotFound.propTypes = {
  message: PropTypes.node
};

module.exports = ServiceItemNotFound;
