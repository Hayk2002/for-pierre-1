import { Form } from "antd";
import { useParams } from "react-router-dom";

import RegisterPage from "./index";

const InvitationRegisterFlow = () => {
  const [form] = Form.useForm();
  const { email } = useParams();

  return <RegisterPage isInvitationFlow form={form} invitedUserEmail={email} />;
};

export default InvitationRegisterFlow;
