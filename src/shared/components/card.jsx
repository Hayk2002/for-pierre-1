import { CardBody, CardHeader, CardWrapper } from "./styles";

const Card = ({ children, title, small, ...rest }) => (
  <CardWrapper {...rest}>
    {title && (
      <CardHeader>
        <div>{title}</div>
      </CardHeader>
    )}
    <CardBody small={small}>{children}</CardBody>
  </CardWrapper>
);

export default Card;
