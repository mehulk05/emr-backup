export interface IEmailTemplate {
  id: number;
  name: string;
  body: string;
  variables: string;
  emailTarget: string;
}
