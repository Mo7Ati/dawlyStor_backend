export interface PhpEnumCase {
    label: string;
    value: string;
}

export interface Enums {
    orderStatus: PhpEnumCase[];
    paymentStatus: PhpEnumCase[];
    permissions: string[];
}
