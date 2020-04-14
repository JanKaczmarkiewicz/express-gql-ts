export type Maybe<T> = T | null;
import { ObjectID } from 'mongodb';
export type UserDbObject = {
  _id: ObjectID,
  username: string,
  email: string,
  password: string,
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};









export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Mutation = {
   __typename?: 'Mutation';
  register?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
  validateEmail: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationValidateEmailArgs = {
  token: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  me: User;
};

export type User = {
   __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
};
