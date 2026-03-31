declare module "nodemailer" {
  const nodemailer: {
    createTransport: (options: unknown) => {
      sendMail: (mail: unknown) => Promise<{ messageId?: string | null }>;
    };
  };

  export default nodemailer;
}
