import React from "react";
import moment from "moment";

import { setActivePageTitle } from "../actions/settings";
import BonzaNotification from "../components/BonzaNotification";
import LoadingOverlay from "../components/LoadingOverlay";
import BonzaTextField from "../components/BonzaTextField";
import BonzaDatePickerField from "../components/BonzaDatePickerField";

import {
  getProduct,
  getPriceSeasons,
  updatePriceSeasons,
} from "../middleware/api/products";
import config from "../config";

import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const noMargin = { marginBottom: `0px` };

const initialSeason = {
  name: `New price season`,
  notes: ``,
  startDate: new Date(),
  finishDate: new Date(),
  adultRate: 0,
  childRate: 0,
  infantRate: 0,
  familyRate: 0,
  additionalAdultRate: 0,
  additionalChildRate: 0,
  seniorConcessionRate: 0,
};

class ProductPriceSeasonsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(
      {},
      {
        loading: true,
        product: false,
        seasons: [],
        errors: [],
      },
      initialSeason,
    );

    this.handleClose = this.handleClose.bind(this);
    this.setValue = this.setValue.bind(this);
    this.addSeason = this.addSeason.bind(this);
    this.deleteSeason = this.deleteSeason.bind(this);

    props.dispatch(setActivePageTitle(`Price seasons`));
  }

  getDefaultPrices(product) {
    return {
      adultRate: product.basePrice ? product.basePrice : 0,
      childRate: product.childPrice ? product.childPrice : 0,
      infantRate: product.infantPrice ? product.infantPrice : 0,
      familyRate: product.familyRate ? product.familyRate : 0,
      additionalAdultRate: product.additionalRate ? product.additionalRate : 0,
      additionalChildRate: product.additionalRate ? product.additionalRate : 0,
      seniorConcessionRate: product.seniorConcessionRate
        ? product.seniorConcessionRate
        : 0,
    };
  }

  componentWillMount() {
    getProduct(this.props.params.id)
      .then((product) => {
        this.props.dispatch(
          setActivePageTitle(`Price seasons of ${product.name}`),
        );
        getPriceSeasons(product.productId)
          .then((seasons) => {
            this.setState(
              Object.assign(
                {
                  loading: false,
                  seasons,
                  product,
                },
                this.getDefaultPrices(product),
              ),
            );
          })
          .catch(() => {
            this.setState({
              loading: false,
              errors: [`Unable to load price seasons for ${product.name}`],
            });
          });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [
            `Unable to get the product with identifier ${this.props.params.id}`,
          ],
        });
      });
  }

  updateSeasons(seasons) {
    this.setState({ loading: true });

    seasons.map((season, index) => {
      if (season.startDate.length !== 10)
        season.startDate = moment(season.startDate).format(`YYYY-MM-DD`);
      if (season.finishDate.length !== 10)
        season.finishDate = moment(season.finishDate).format(`YYYY-MM-DD`);
      seasons[index] = season;
    });

    updatePriceSeasons(this.props.params.id, seasons)
      .then(() => {
        getPriceSeasons(this.props.params.id)
          .then((seasons) => {
            this.setState(
              Object.assign(
                { seasons, loading: false },
                initialSeason,
                this.getDefaultPrices(this.state.product),
              ),
            );
          })
          .catch(() => {
            this.setState({
              loading: false,
              errors: [`Unable to load price seasons`],
            });
          });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to update price seasons`],
        });
      });
  }

  addSeason() {
    let seasons = JSON.parse(JSON.stringify(this.state.seasons));
    seasons.push({
      name: this.state.name,
      notes: this.state.notes,
      startDate: moment(this.state.startDate).format(`YYYY-MM-DD`),
      finishDate: moment(this.state.finishDate).format(`YYYY-MM-DD`),
      adultRate:
        this.state.adultRate && parseFloat(this.state.adultRate) >= 0
          ? parseFloat(this.state.adultRate)
          : 0,
      childRate:
        this.state.childRate && parseFloat(this.state.childRate) >= 0
          ? parseFloat(this.state.childRate)
          : 0,
      infantRate:
        this.state.infantRate && parseFloat(this.state.infantRate) >= 0
          ? parseFloat(this.state.infantRate)
          : 0,
      familyRate:
        this.state.familyRate && parseFloat(this.state.familyRate) >= 0
          ? parseFloat(this.state.familyRate)
          : 0,
      additionalAdultRate:
        this.state.additionalAdultRate &&
        parseFloat(this.state.additionalAdultRate) >= 0
          ? parseFloat(this.state.additionalAdultRate)
          : 0,
      additionalChildRate:
        this.state.additionalChildRate &&
        parseFloat(this.state.additionalChildRate) >= 0
          ? parseFloat(this.state.additionalChildRate)
          : 0,
      seniorConcessionRate:
        this.state.seniorConcessionRate &&
        parseFloat(this.state.seniorConcessionRate) >= 0
          ? parseFloat(this.state.seniorConcessionRate)
          : 0,
    });

    this.updateSeasons(seasons);
  }

  deleteSeason(index, name) {
    if (confirm(`Delete ${name}?`)) {
      let seasons = JSON.parse(JSON.stringify(this.state.seasons));
      seasons.splice(index, 1);
      this.updateSeasons(seasons);
    }
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      errors: [],
    });
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    let seasonsControls = [];
    this.state.seasons.map((season, index) => {
      let fromTo = ``;
      if (season.seasonID) {
        fromTo =
          moment(season.startDate).format(config.momentDateFormat) +
          " - " +
          moment(season.finishDate).format(config.momentDateFormat);
      } else {
        fromTo =
          moment(season.startDate, `YYYY-MM-DD`).format(
            config.momentDateFormat,
          ) +
          " - " +
          moment(season.finishDate, `YYYY-MM-DD`).format(
            config.momentDateFormat,
          );
      }

      seasonsControls.push(
        <ExpansionPanel
          defaultExpanded={false}
          key={`expansion_panel_${index}`}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {season.name} ({fromTo})
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {season.description ? (
              <Typography>{season.description}</Typography>
            ) : (
              false
            )}

            <div style={{ width: `100%` }}>
              <div>
                {season.notes ? (
                  <div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                        style={noMargin}
                      >
                        <Typography variant="body1">
                          Notes: {season.notes}
                        </Typography>
                      </div>
                    </div>
                    <Divider
                      style={{ marginTop: `10px`, marginBottom: `10px` }}
                    />
                  </div>
                ) : (
                  false
                )}

                <div className="row">
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <Typography variant="body1">
                      Adult rate (base price): {season.adultRate}
                    </Typography>
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <Typography variant="body1">
                      Child rate: {season.childRate}
                    </Typography>
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <Typography variant="body1">
                      Infant rate: {season.infantRate}
                    </Typography>
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <Typography variant="body1">
                      Family rate: {season.familyRate}
                    </Typography>
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <Typography variant="body1">
                      Additional adult rate: {season.additionalAdultRate}
                    </Typography>
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <Typography variant="body1">
                      Additional child rate: {season.additionalChildRate}
                    </Typography>
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <Typography variant="body1">
                      Senior / consession rate: {season.seniorConcessionRate}
                    </Typography>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                    style={{ textAlign: `right` }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        this.deleteSeason(index, season.name);
                      }}
                      style={{ marginBottom: `0px` }}
                    >
                      Delete season
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>,
      );
    });

    if (this.state.seasons.length === 0) {
      seasonsControls = (
        <div>
          <Typography variant="body1">No seasons created yet</Typography>
        </div>
      );
    }

    return (
      <div style={{ position: `relative` }}>
        {loadingOverlay}
        {this.state.product ? (
          <div style={{ paddingBottom: `10px` }}>
            <div>
              <Paper elevation={1} style={{ padding: `14px` }}>
                <div>
                  <div className="row">
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Name"
                        required={true}
                        value={this.state.name}
                        fullWidth={true}
                        name="name"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-8 col-lg-8 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Notes"
                        value={this.state.notes}
                        multiline={true}
                        rows={2}
                        fullWidth={true}
                        name="notes"
                        onChange={this.setValue}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                      style={noMargin}
                    >
                      <BonzaDatePickerField
                        title="Starting from"
                        required={true}
                        value={this.state.startDate}
                        name="startDate"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-8 col-lg-8 m-b-15"
                      style={noMargin}
                    >
                      <BonzaDatePickerField
                        title="Ending on"
                        required={true}
                        value={this.state.finishDate}
                        name="finishDate"
                        onChange={this.setValue}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Adult rate (base price)"
                        value={this.state.adultRate}
                        name="adultRate"
                        type="number"
                        prefix="$"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Child rate"
                        value={this.state.childRate}
                        name="childRate"
                        type="number"
                        prefix="$"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Infant rate"
                        value={this.state.infantRate}
                        name="infantRate"
                        type="number"
                        prefix="$"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Family rate"
                        value={this.state.familyRate}
                        name="familyRate"
                        type="number"
                        prefix="$"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Additional adult rate"
                        value={this.state.additionalAdultRate}
                        name="additionalAdultRate"
                        type="number"
                        prefix="$"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Additional child rate"
                        value={this.state.additionalChildRate}
                        name="additionalChildRate"
                        type="number"
                        prefix="$"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Senior / consession rate"
                        value={this.state.seniorConcessionRate}
                        name="seniorConcessionRate"
                        type="number"
                        prefix="$"
                        onChange={this.setValue}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                      style={{ textAlign: `left`, paddingTop: `16px` }}
                    >
                      <Typography variant="body1">
                        Default product prices are initially used
                      </Typography>
                    </div>
                    <div
                      className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                      style={{ textAlign: `right` }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          !this.state.name ||
                          !this.state.startDate ||
                          !this.state.finishDate ||
                          moment(this.state.finishDate).isBefore(
                            this.state.startDate,
                          )
                        }
                        onClick={this.addSeason}
                        style={{ marginBottom: `0px` }}
                      >
                        Add season
                      </Button>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
            <div style={{ paddingTop: `10px` }}>{seasonsControls}</div>
          </div>
        ) : (
          false
        )}
        <BonzaNotification
          errors={this.state.errors}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default ProductPriceSeasonsPage;
