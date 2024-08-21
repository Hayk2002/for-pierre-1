import { Success } from "assets/images";
import { StepItem } from "../styles";

const Step = ({ current, title, count }) => (
  <StepItem active={current + 1 >= count}>
    <div>
      {current + 1 > count ? (
        <>
          <Success width={44} height={44} viewBox="0 0 60 60" />
          <p>{title}</p>
        </>
      ) : (
        <>
          <span>{count}</span>
          <p>{title}</p>
        </>
      )}
    </div>
    <span />
  </StepItem>
);

export default Step;
