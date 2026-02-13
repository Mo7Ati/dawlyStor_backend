export interface PhpEnumCase {
    label: string;
    value: string;
}

export interface Enums {
    orderStatus: PhpEnumCase[];
    paymentStatus: PhpEnumCase[];
    permissions: PermissionsEnum;
}

export enum PermissionsEnum {
    // dashboard permissions
    DASHBOARD_INDEX = "dashboard.index",

    // admin permissions
    ADMINS_INDEX = "admins.index",
    ADMINS_SHOW = "admins.show",
    ADMINS_CREATE = "admins.create",
    ADMINS_UPDATE = "admins.update",
    ADMINS_DESTROY = "admins.destroy",

    // roles permissions
    ROLES_INDEX = "roles.index",
    ROLES_SHOW = "roles.show",
    ROLES_CREATE = "roles.create",
    ROLES_UPDATE = "roles.update",
    ROLES_DESTROY = "roles.destroy",

    // stores permissions
    STORES_INDEX = "stores.index",
    STORES_SHOW = "stores.show",
    STORES_CREATE = "stores.create",
    STORES_UPDATE = "stores.update",
    STORES_DESTROY = "stores.destroy",

    // store categories permissions
    STORE_CATEGORIES_INDEX = "store-categories.index",
    STORE_CATEGORIES_SHOW = "store-categories.show",
    STORE_CATEGORIES_CREATE = "store-categories.create",
    STORE_CATEGORIES_UPDATE = "store-categories.update",
    STORE_CATEGORIES_DESTROY = "store-categories.destroy",

    // products permissions
    PRODUCTS_INDEX = "products.index",
    PRODUCTS_SHOW = "products.show",
    PRODUCTS_CREATE = "products.create",
    PRODUCTS_UPDATE = "products.update",
    PRODUCTS_DESTROY = "products.destroy",

    // orders permissions
    ORDERS_INDEX = "orders.index",
    ORDERS_SHOW = "orders.show",
    ORDERS_CREATE = "orders.create",
    ORDERS_UPDATE = "orders.update",
    ORDERS_DESTROY = "orders.destroy",

    // users permissions
    USERS_INDEX = "users.index",
    USERS_SHOW = "users.show",
    USERS_CREATE = "users.create",
    USERS_UPDATE = "users.update",
    USERS_DESTROY = "users.destroy",

    // sections permissions
    SECTIONS_INDEX = "sections.index",
    SECTIONS_SHOW = "sections.show",
    SECTIONS_CREATE = "sections.create",
    SECTIONS_UPDATE = "sections.update",
    SECTIONS_DESTROY = "sections.destroy",

    // transactions permissions
    TRANSACTIONS_INDEX = "transactions.index",

    // wallets permissions
    WALLETS_INDEX = "wallets.index",
}

