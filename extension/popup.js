// document.getElementById('clickme').addEventListener('click', runBackgroundJs);

var googleApi = document.createElement('script');
googleApi.src = chrome.extension.getURL('gapi.js');
googleApi.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(googleApi);

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
    	handleClientLoad();
    }
}

// Client ID and API key from the Developer Console
var CLIENT_ID = '891989120497-dn7mqqv9dpq5n7pu6mkpcs32eoq1q39t.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCuIF8r_jO55O6zksQSuP6rsrziCBS3BKo';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  console.log("handleClientLoading");
  gapi.load('client:auth2', initClient);
  console.log("handleClientLoaded");
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  appendPre("Hit there");
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listMajors();
    // appendToSheet();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

function appendToSheet() {
  var params = {
    // The ID of the spreadshspreadsheeteet to update.
    spreadsheetId: '1TY_EK3ezfAuZwklVTGLmCakt6EhwO8IkioWHhUaHu7I',  // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: 'Nguyen Van Ngoc!BA4:BC6',  // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: 'RAW',  // TODO: Update placeholder value.

    // How the input data should be inserted.
    // insertDataOption: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
    insertDataOption: 'OVERWRITE',  // TODO: Update placeholder value.
  };

  var valueRangeBody = {
    // Value range body: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRanges
    // Dimension: https://developers.google.com/sheets/api/reference/rest/v4/Dimension
    "majorDimension": "ROWS",
    "values": [
    // List Value: https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#listvalue
      ["7:45", "17:15", "1:00"],
      ["7:35", "17:25", "1:00"],
      ["7:55", "17:00", "1:00"],
    ],
  };

  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1MbguPnGHap8OOe1D7RLImuM2Bp8jN4SggEQdZ2Dcr_U',
    range: 'Class Data!A2:E',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      appendPre('Name, Major:');
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        appendPre(row[0] + ', ' + row[4]);
      }
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}
