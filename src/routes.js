import React from "react";
import { Route, IndexRoute } from "react-router";
import BonzaRequireAuth from "./components/BonzaRequireAuth";
import App from "./containers/App";

import NotFoundPage from "./containers/NotFoundPage.js";
import CheckinPage from "./containers/CheckinPage";
import LoginPage from "./containers/LoginPage";

import PurchasesSearchPage from "./containers/PurchasesSearchPage";
import PaymentsHistoryPage from "./containers/PaymentsHistoryPage";
import PaymentPage from "./containers/PaymentPage";
import RefundPage from "./containers/RefundPage";
import TourPurchasePage from "./containers/TourPurchasePage";
import MiscPurchasePage from "./containers/MiscPurchasePage";

import BookingPartnersSearchPage from "./containers/BookingPartnersSearchPage";
import BookingPartnerPage from "./containers/BookingPartnerPage";
import BookingPartnerPurchasesPage from "./containers/BookingPartnerPurchasesPage";

import ProductsPage from "./containers/ProductsPage";
import ProductPage from "./containers/ProductPage";
import ProductPriceSeasonsPage from "./containers/ProductPriceSeasonsPage";
import ProductAllotmentsPage from "./containers/ProductAllotmentsPage";
import ProductEditAllotmentsPage from "./containers/ProductEditAllotmentsPage";

import EmailTemplatesPage from "./containers/EmailTemplatesPage";
import EmailTemplatePage from "./containers/EmailTemplatePage";
import EmailHistoryPage from "./containers/EmailHistoryPage";

import UpcomingPage from "./containers/reports/UpcomingPage";
import UpcomingMiscPurchasesPage from "./containers/reports/UpcomingMiscPurchasesPage";
import PaymentsReceivedPage from "./containers/reports/PaymentsReceivedPage";
import FinancialAnalysisToursPage from "./containers/reports/FinancialAnalysisToursPage";
import FinancialAnalysisMiscPage from "./containers/reports/FinancialAnalysisMiscPage";

import DiscountsPage from "./containers/DiscountsPage";
import DiscountPage from "./containers/DiscountPage";

import UsersPage from "./containers/UsersPage";
import UserPage from "./containers/UserPage";
import SettingsPage from "./containers/SettingsPage";

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={BonzaRequireAuth(CheckinPage)} />
      <Route path="login" component={LoginPage} />
      {/* Purchase routes */}
      <Route
        path="purchases/search"
        component={BonzaRequireAuth(PurchasesSearchPage)}
      />
      <Route
        path="purchases/:id/history"
        component={BonzaRequireAuth(PaymentsHistoryPage)}
      />
      <Route
        path="purchases/:id/payment"
        component={BonzaRequireAuth(PaymentPage)}
      />
      <Route
        path="purchases/:id/refund"
        component={BonzaRequireAuth(RefundPage)}
      />
      <Route
        path="purchases/add-tour"
        component={BonzaRequireAuth((props) => (
          <TourPurchasePage {...props} />
        ))}
      />
      <Route
        path="purchases/edit-tour/:id"
        component={BonzaRequireAuth((props) => (
          <TourPurchasePage {...props} />
        ))}
      />
      <Route
        path="purchases/add-misc"
        component={BonzaRequireAuth((props) => (
          <MiscPurchasePage {...props} />
        ))}
      />
      <Route
        path="purchases/edit-misc/:id"
        component={BonzaRequireAuth((props) => (
          <MiscPurchasePage {...props} />
        ))}
      />
      <Route
        path="purchases/check-in"
        component={BonzaRequireAuth(CheckinPage)}
      />
      {/* Booking partner routes */}
      <Route
        path="booking-partners"
        component={BonzaRequireAuth(BookingPartnersSearchPage)}
      />
      <Route
        path="booking-partners/add"
        component={BonzaRequireAuth((props) => (
          <BookingPartnerPage {...props} />
        ))}
      />
      <Route
        path="booking-partners/edit/:id"
        component={BonzaRequireAuth((props) => (
          <BookingPartnerPage {...props} />
        ))}
      />
      <Route
        path="booking-partners/:id/purchases"
        component={BonzaRequireAuth(BookingPartnerPurchasesPage)}
      />
      TOURS
      {/* Products */}
      <Route path="products" component={BonzaRequireAuth(ProductsPage)} />
      <Route path="products/add" component={BonzaRequireAuth(ProductPage)} />
      <Route
        path="products/edit/:id"
        component={BonzaRequireAuth(ProductPage)}
      />
      <Route
        path="products/:id/allotments/edit"
        component={BonzaRequireAuth(ProductEditAllotmentsPage)}
      />
      <Route
        path="products/:id/seasons"
        component={BonzaRequireAuth(ProductPriceSeasonsPage)}
      />
      <Route
        path="products/:id/allotments"
        component={BonzaRequireAuth(ProductAllotmentsPage)}
      />
      {/* Email templates and communication control */}
      <Route
        path="emails/templates"
        component={BonzaRequireAuth(EmailTemplatesPage)}
      />
      <Route
        path="emails/templates/add"
        component={BonzaRequireAuth(EmailTemplatePage)}
      />
      <Route
        path="emails/templates/edit/:id"
        component={BonzaRequireAuth(EmailTemplatePage)}
      />
      <Route
        path="emails/history"
        component={BonzaRequireAuth(EmailHistoryPage)}
      />
      {/* Reports */}
      <Route
        path="reports/upcoming/tours"
        component={BonzaRequireAuth(UpcomingPage)}
      />
      <Route
        path="reports/upcoming/misc"
        component={BonzaRequireAuth(UpcomingMiscPurchasesPage)}
      />
      <Route
        path="reports/payments-received"
        component={BonzaRequireAuth(PaymentsReceivedPage)}
      />
      <Route
        path="reports/financial-analysis/tours"
        component={BonzaRequireAuth(FinancialAnalysisToursPage)}
      />
      <Route
        path="reports/financial-analysis/misc"
        component={BonzaRequireAuth(FinancialAnalysisMiscPage)}
      />
      {/* Users and application settings */}
      <Route path="users" component={BonzaRequireAuth(UsersPage)} />
      <Route path="users/add" component={BonzaRequireAuth(UserPage)} />
      <Route path="users/edit/:id" component={BonzaRequireAuth(UserPage)} />
      <Route path="settings" component={BonzaRequireAuth(SettingsPage)} />
      {/* 404 route */}
      {/* Discouts */}
      <Route path="discounts" component={BonzaRequireAuth(DiscountsPage)} />
      <Route path="/discounts/add" component={BonzaRequireAuth(DiscountPage)} />
      <Route
        path="discounts/edit/:id"
        component={BonzaRequireAuth(DiscountPage)}
      />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Route>
);
