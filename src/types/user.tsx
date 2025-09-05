export interface Secret {
  _id: string;
  title: string;
  secret: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  secrets: Secret[];
}