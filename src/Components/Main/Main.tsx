import React, { useState } from "react";
import exclusionData from "../../mock/Exclusions.json";
import "./Main.scss";

export const Main = () => {
  const [textInput, setTextInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const exclusionChecker = (textInput: string) => {
    const exclusionList = exclusionData;
    if (
      exclusionList.filter((exclusion) => textInput === exclusion.PartNumber)
        .length > 0
    ) {
      return true;
    }
    return false;
  };

  const partFilter = (stringToBeChecked: string) => {
    const partNumber = stringToBeChecked;
    setIsSuccessful(false);

    // 1) check it has a hyphen after 4 characters, else error
    if (partNumber.indexOf("-") !== 4) {
      setErrorMessage("It's not a valid part");
      setHasError(true);
      return;
    }

    // 2) split on the hyphen
    const partNumberArray = partNumber.split("-");

    // 3) Check first section (partID) is 4 characters long, else error
    if (partNumberArray[0].length !== 4) {
      setErrorMessage("The partID is too long");
      setHasError(true);
      return;
    }

    // 4) Regex to check first section (partID) contains only digits, else error
    if (partNumberArray[0].match(/[^0-9]+/)) {
      setErrorMessage("The PartID takes digits only");
      setHasError(true);
      return;
    }

    // 5) Check second section is at least 4 characters long, else error
    if (partNumberArray[1].length! <= 3) {
      setErrorMessage("The PartCode is too short");
      setHasError(true);
      return;
    }
    // 6) Regex second section to check all alpha numeric only else error

    if (partNumberArray[1].match(/[^A-Za-z0-9]+/)) {
      setErrorMessage("The PartCode takes alphanumeric codes only");
      setHasError(true);
      return;
    }

    if (exclusionChecker(partNumber)) {
      setErrorMessage(`${partNumber} is unfortunately on our Exclusions List`);
      setHasError(true);
      return;
    }

    // 7) return
    setHasError(false);
    setErrorMessage("");
    setIsSuccessful(true);
    return stringToBeChecked;
  };

  return (
    <div className="Main">
      <div className="Main-container">
        <h1 className="Main-title">Welcome to PartsTrader</h1>
        <div className="Main-form">
          <p className="Main-formTitle">Please search for your part here</p>
          <label className="Main-label" htmlFor="filterInput">
            Filter input
          </label>
          <input
            className="Main-input"
            name="filterInput"
            type="text"
            onChange={(e) => setTextInput(e.target.value)}
            value={textInput}
            placeholder={"Find a part"}
          />
          <button className="Main-button" onClick={() => partFilter(textInput)}>
            Submit
          </button>
        </div>
        <div className="Main-results">
          {hasError && (
            <h3 className="Main-resultsTitle">
              We have a problem! {errorMessage}
            </h3>
          )}
          {isSuccessful && (
            <h3 className="Main-resultsTitle">
              Alright! Let's go find {textInput}!
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};
