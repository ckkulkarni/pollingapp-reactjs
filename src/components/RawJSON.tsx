import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

const RawJSON = () => {
  const location = useLocation();
  const details = location.state;
  return (
    <div className="raw-json-container" data-testid="raw-json-display">
      <h1>Raw JSON Data:</h1>
      <pre className="raw-json" data-testid="raw-json">
        {JSON.stringify(details.hit, null, 2)}
      </pre>
      <Link to="/">
        {details.hit && (
          <button className="back-button" data-testid="backButton">
            Back to List
          </button>
        )}
      </Link>
    </div>
  );
};

export default RawJSON;
