export const sendNewsletter = async ({
  email,
  wishList,
  originCode,
}: {
  email: string;
  wishList: string[];
  originCode: string;
}) => {
  console.log("Enviando newsletter para", email);
  console.log(wishList);
};
