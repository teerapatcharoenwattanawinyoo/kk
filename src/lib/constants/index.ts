export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER_EMAIL: "/auth/register",
    REGISTER_PHONE: "/auth/register/phone",
    POLICY: "/policy",
    TERM: "/terms",
    CREATE_PROFILE: "/auth/create-profile",
    DASHBOARD: "/dashboard",
    TEAM: "/team-host/list",
    ADD_TEAM: "/team-groups/create",
    // VERIFY_EMAIL: "/auth/verify-email",
    // VERIFY_PHONE: "/auth/verify-phone-otp",
    UPDATE_TEAM: "/team-groups",
    DELETE_TEAM: "/team-groups",
    REFRESH: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    VERIFY_PHONE: "/auth/verify-phone",
  },
  STATION: {
    CATEGORIES: "/station-types",
    LIST: "/partner-station/station/list",
    DETAIL: "/team-groups/station-detail",
    CREATE: "/partner-station/create",
    TEAM_STATIONS: "/team-groups/charging/station/list",
    UPDATE: "/partner-station/update",
    DELETE: "/partner-station",
  },
  CHARGER: {
    BRANDS: "/charger-brands",
    CREATE: "/charger/create",
    UPDATE: "/charger/update",
    DELETE: "/charger",
    UPDATE_SERIAL: "/charger/update-serial-number",
    CHECK_CONNECTION: "/charger/check-connection",
    CHARGER_DETAIL: "/team-groups/charging/charger/",
    LIST: "/team-groups/charging/charger/list",
    CHARGER_TYPES: "/charger-type",
  },
  CONNECTOR: {
    CREATE: "/plug/create",
    LIST: "/team-groups/charging/connector/list",
    DETAIL: "/team-groups/charging/connector/detail",
    UPDATE: "/plug/update/",
    DELETE: "/plug",
  },
  SET_PRICE: {
    LIST: "/price-set",
    CREATE_BY_PARENT: "/price-set/create-by-parent",
    CREATE_PRICE: "/price-set/create",
    EDIT: "/price-set/edit",
    UPDATE: "/price-set",
  },
  TEAM_GROUPS: {
    TEAMS: {
      LIST: "/team-host/list",
      CREATE: "/team-groups/create",
      UPDATE: "/team-groups/{team_group_id}",
      DELETE: "/team-groups/{team_group_id}",
    },
    SETTINGS: {
      TAX: {
        INFORMATION: {
          LIST: "/setting-dashboard/tax/{team_group_id}",
          CREATE: "/setting-dashboard/tax",
          DELETE: "/setting-dashboard/tax/{id}",
          UPDATE: "/setting-dashboard/tax/{team_group_id}",
        },
        RECEIPT: {
          LIST: "/setting-dashboard/receipt/{team_group_id}",
          CREATE: "/setting-dashboard/receipt",
          DELETE: "/setting-dashboard/receipt/{id}",
          UPDATE: "/setting-dashboard/receipt/{team_group_id}",
        },
        TYPES: {
          LIST: "/individual-types",
        },
      },
    },
    TRANSACTIONS: {
      LIST: "/transaction/dashboard",
      DETAIL: "/transaction/dashboard/{transaction_id}",
    },
    REVENUE: {
      BANK: {
        LIST: "/partner/bank-account",
        CREATE: "/partner/bank-account",
        UPDATE: "/partner/bank-account/{id}",
        DELETE: "/partner/bank-account/{id}",
        GET_BY_ID: "/partner/bank-account/{id}",
        BANK_LISTS: "/partner/bank-account/bank-lists",
      },
      BALANCE: "/partner/revenue/balance/team/{team_group_id}",
      PAYOUT: {
        INIT: "/partner/revenue/payout/init",
        CONFIRM: "/partner/revenue/payout/confirm",
      },
    },
  },
} as const;

export const ROUTES = {
  //auth routes
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  //main routes
  DASHBOARD: "/dashboard",
  TEAM: "/team",
  TEAM_OVERVIEW: "/team/[id]/overview",
  TEAM_EDIT: "/team/[id]/edit-team",
  TEAM_CHARGING_STATIONS: "/team/[id]/charging-stations",
  TEAM_CHARGERS: "/team/[id]/chargers",
  TEAM_MEMBERS: "/team/[id]/members",
  TEAM_PRICING: "/team/[id]/price-groups",
  TEAM_PAYMENT: "/team/[id]/payment",
  TEAM_REVENUE: "/team/[id]/revenue",
  TEAM_VEHICLES: "/team/[id]/vehicles",
  TEAM_SETTINGS: "/team/[id]/settings",
  CREATE_TEAM: "/team/add-team",
} as const;

export const COOKIE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const QUERY_KEYS = {
  USER: ["user"],
  AUTH: ["auth"],
  TEAMS: ["teams"],
  TEAM: ["team"],
  STATION: ["station"],
  CONNECTOR: ["connector"],
  PRICE_SET: ["price_set"],
  TAX_TYPES: ["tax_types"],
  TAX_INFORMATION: ["tax_information"],
  INVOICE_PREFIX: ["invoice_prefix"],
  BANK_ACCOUNTS: ["bank_accounts"],
  BANK_ACCOUNT: ["bank_account"],
  BANK_LISTS: ["bank_lists"],
  REVENUE_BALANCE: ["revenue_balance"],
  PAYOUT: ["payout"],
} as const;
