# Change Log

All notable changes to this project will be documented in this file.

## 2019-10-6

Various fixes specified in the [October 2019 BMS Updates - Final List](https://docs.google.com/spreadsheets/d/11XMNMnkTgSM7v8G3r8alT243kV6J0K2lx59BDvrThyQ/edit#gid=1492423278)

### Added

- Showing E-bike upgrades in Important notes section on the Check-in page;
- Deleting standalone misc purchases;

### Changed

- Status filter is moved to the initial filters section in Search purchase page;

### Fixed

## 2019-10-5

Various fixes specified in the [October 2019 BMS Updates - Final List](https://docs.google.com/spreadsheets/d/11XMNMnkTgSM7v8G3r8alT243kV6J0K2lx59BDvrThyQ/edit#gid=1492423278)

### Added

- Additional buttons for misc purchase editing page;

### Changed

- Payments received report has the same accounting status management control as other reports;

### Fixed

## 2019-10-4

Various fixes specified in the [October 2019 BMS Updates - Final List](https://docs.google.com/spreadsheets/d/11XMNMnkTgSM7v8G3r8alT243kV6J0K2lx59BDvrThyQ/edit#gid=1492423278)

### Changed

- More verbose bulk adding and removing from accounting on tour and misc report pages;

### Fixed

- When the accounting status is changed in Payments received report, the screen does not freeze;
- When searching for misc purchases, the linked tour purchases properties are taken into account (booking reference identifiers, travel agencies, family, famils, traveller names);

## 2019-10-3

Various fixes specified in the [October 2019 BMS Updates - Final List](https://docs.google.com/spreadsheets/d/11XMNMnkTgSM7v8G3r8alT243kV6J0K2lx59BDvrThyQ/edit#gid=1492423278)

### Added

- Misc purchase product prices can be set to 0$, so the overall misc purchase can have the total price of 0$ (as the tour purchases);

### Changed

- Whenever the tour type is changed, the departure time switch is disabled and the departure time is set to null;

### Fixed

- When tour booking (with already attached misc purchase) is updated, the purchase date does not change to the "Invalid date";
- When attached misc purchase is edited, the purchase date value is taken from the parent tour booking purchase (it used to be taken from the tour date);
- If the misc purchase is the standalone one, then its purchase date is editable;
