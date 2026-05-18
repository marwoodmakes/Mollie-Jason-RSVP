/**
 * WEDDING RSVP - Google Apps Script Backend
 *
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Rename Sheet1 to "RSVPs"
 * 3. Add headers in row 1: Timestamp | First Name | Last Name | Dietary | Bottle | Guests JSON | Status | Camping
 * 4. Go to Extensions > Apps Script
 * 5. Paste this entire file
 * 6. Click Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the URL and put it in your .env.local as GOOGLE_SCRIPT_URL
 */

const SHEET_NAME = "RSVPs";

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  const rsvps = [];
  const bottles = {};

  var declines = [];

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[1]) continue; // skip empty rows

    const status = row[6] || "accepted";

    if (status === "declined") {
      declines.push({
        timestamp: row[0],
        firstName: row[1],
        lastName: row[2],
      });
      continue;
    }

    const rsvp = {
      timestamp: row[0],
      firstName: row[1],
      lastName: row[2],
      dietary: row[3],
      bottle: row[4],
      guests: row[5] ? JSON.parse(row[5]) : [],
      camping: row[7] === true || row[7] === "true" || row[7] === "Yes",
    };

    rsvps.push(rsvp);
    bottles[rsvp.bottle] = (bottles[rsvp.bottle] || 0) + 1;
  }

  return ContentService.createTextOutput(JSON.stringify({ rsvps, bottles, declines }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const payload = JSON.parse(e.postData.contents);

  // If it's a full data sync (has rsvps array), rebuild the sheet
  if (payload.rsvps) {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 8).clearContent();
    }

    payload.rsvps.forEach(function(rsvp) {
      sheet.appendRow([
        rsvp.timestamp || new Date().toISOString(),
        rsvp.firstName,
        rsvp.lastName,
        rsvp.dietary,
        rsvp.bottle,
        JSON.stringify(rsvp.guests || []),
        "accepted",
        rsvp.camping ? "Yes" : "No",
      ]);
    });
  } else if (payload.declined) {
    // Decline submission
    sheet.appendRow([
      payload.timestamp || new Date().toISOString(),
      payload.firstName,
      payload.lastName,
      "",
      "",
      "",
      "declined",
      "",
    ]);
  } else {
    // Single RSVP submission
    sheet.appendRow([
      new Date().toISOString(),
      payload.firstName,
      payload.lastName,
      payload.dietary,
      payload.bottle,
      JSON.stringify(payload.guests || []),
      "accepted",
      payload.camping ? "Yes" : "No",
    ]);
  }

  // Return current state
  return doGet();
}
