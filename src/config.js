/**
 * Application-wide settings
 */

export default {
  // Format for MomentJS formatted output for date
  momentDateFormat: `ddd, D MMM YYYY`,
  // Format for MomentJS formatted output for date and time
  momentDateTimeFormat: `ddd, D MMM YYYY HH:mm`,
  // Format for MomentJS formatted output for time
  momentTimeFormat: `hh:mma`,
  // Available cities
  cities: [`Sydney`, `Melbourne`],
  // Available purchase statuses
  statuses: [`active`, `cancelled`, `deleted`, `refunded`],
  // Application title
  title: `BonzaBikeTours CRM`,
  // REST API URL
  apiURL: process.env.REACT_APP_API_URL,
  // Session cookie name
  sessionCookieName: `connect.sid`,
  // Countries list
  countries:
    `Australia,New Zealand,United Kingdom,U.S. United States,------------------,Albania,Algeria,American Samoa,Andorra,Angola,Anguilla,Antarctica,Antigua And Barbuda,Argentina,Armenia,Aruba,Austria,Azerbaijan,Bahamas,Bahrain,Bangladesh,Barbados,Belarus,Belgium,Belize,Benin,Bermuda,Bhutan,Bolivia,Bosnia and Herzegowina,Botswana,Bouvet Island,Brazil,Brunei Darussalam,Bulgaria,Burkina Faso,Burma,Burundi,Cambodia,Cameroon,Canada,Cape Verde,Cayman Islands,Central African Republic,Chad,Chile,Christmas Island,Cocos (Keeling) Islands,Colombia,Comoros,Congo,Cook Islands,Costa Rica,Cote dIvoire,Croatia,Cyprus,Czech Republic,Denmark,Djibouti,Dominica,Dominican Republic,East Timor,Ecuador,Egypt,El Salvador,England,Equatorial Guinea,Eritrea,Espana,Estonia,Ethiopia,Falkland Islands,Faroe Islands,Fiji,Finland,France,French Guiana,French Polynesia,Gabon,Gambia,Georgia,Germany,Ghana,Gibraltar,Great Britain,Greece,Greenland,Grenada,Guadeloupe,Guam,Guatemala,Guinea,Guinea-Bissau,Guyana,Haiti,Honduras,Hong Kong,Hungary,Iceland,India,Indonesia,Ireland,Israel,Italy,Jamaica,Japan,Jordan,Kazakhstan,Kenya,Kiribati,Korea (South),Korea - Republic of,Kuwait,Kyrgyzstan,Latvia,Lebanon,Lesotho,Liberia,Liechtenstein,Lithuania,Luxembourg,Macau,Macedonia,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,Marshall Islands,Martinique,Mauritania,Mauritius,Mayotte,Mexico,Moldova - Republic of,Monaco,Mongolia,Montserrat,Morocco,Mozambique,Myanmar,Namibia,Nauru,Nepal,Netherlands,Netherlands Antilles,New Caledonia,Nicaragua,Niger,Nigeria,Niue,Norfolk Island,Northern Ireland,Northern Mariana Islands,Norway,Oman,Pakistan,Palau,Panama,Papua New Guinea,Paraguay,Peru,Philippines,Pitcairn,Poland,Portugal,Puerto Rico,Qatar,Reunion,Romania,Russia,Russian Federation,Rwanda,Saint Kitts and Nevis,Saint Lucia,Samoa (Independent),San Marino,Sao Tome and Principe,Saudi Arabia,Scotland,Senegal,Seychelles,Sierra Leone,Singapore,Slovakia,Slovenia,Solomon Islands,Somalia,South Africa,South Korea,Spain,Sri Lanka,St. Helena,St. Pierre and Miquelon,Suriname,Swaziland,Sweden,Switzerland,Taiwan,Tajikistan,Tanzania,Thailand,Togo,Tokelau,Tonga,Trinidad,Triniad and Tobago,Tunisia,Turkey,Turkmenistan,Tuvalu,Uganda,Ukraine,United Arab Emirates,Uruguay,Uzbekistan,Vanuatu,Venezuela,Viet Nam,Virgin Islands (British),Virgin Islands (U.S.),Wales,Western Sahara,Yemen,Zambia,Zimbabwe`.split(
      `,`,
    ),
  // Booking sources
  bookingSources: [`Phone`, `Email`, `Walkup`, `Concierge`],
  // Language for tour purchase
  languages: [`English`, `French`, `German`, `Other`],
  // Payment methods (id is always in lower case)
  paymentMethods: [
    `In store - Cash`,
    `In store - Stripe`,
    `In store - Amex (terminal)`,
    `In store - Amex (tablet)`,
    `In store - Visa/MasterCard (terminal)`,
    `In store - Visa/MasterCard (tablet)`,
    `In store - Union Pay (terminal)`,
    `In store - Union Pay (tablet)`,
    `In store - PayPal `,
    `Website - Stripe`,
    `Website - PayPal`,
    `invoice`,
    `cash`,
    `credit`,
    `webdirect`,
    `stripe`,
    `paypal`,
    `jotform`,
  ],
  // Days of week
  daysOfWeek: [
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
    `Sunday`,
  ],
  // User groups
  userGroups: [
    {
      groupId: 1,
      groupCode: `ADMIN`,
      groupName: `Administrator`,
    },
    {
      groupId: 2,
      groupCode: `MANAGER`,
      groupName: `Manager`,
    },
  ],
  // Super-user group index
  superUserGroupIndex: 0,
};
