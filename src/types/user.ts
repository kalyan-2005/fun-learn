export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  image?: string;
  emailVerified: Date;
  oneTimePassword?: string;
  profile?: Profile;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  hearts: number;
  diamonds: number;
  supercoins: number;
}

export interface Profile {
  id: string;

  bio?: string;

  createdAt: Date;
  updatedAt: Date;
}
