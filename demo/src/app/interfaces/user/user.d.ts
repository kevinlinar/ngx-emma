export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipCode: string;
  geo: Geo;
}

export interface Geo {
  lat: string | number;
  lng: string | number;
}

export interface Company {
  name: string;
  catchPhrase: string;
  buzzPhrase: string;
}
