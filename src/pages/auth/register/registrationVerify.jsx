import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { selectIsLoading } from "store/selectors";
import CircleLoader from "shared/components/circleLoader";
import { verifyRegistration } from "../actions";

const RegistrationVerify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsLoading);

  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const token = query.get("token");

  useEffect(() => {
    dispatch(
      verifyRegistration({ email, verificationToken: token }, () =>
        navigate("/completeProfile"),
      ),
    );
  }, [dispatch, navigate, email, token]);

  return isFetching ? <CircleLoader /> : null;
};

export default RegistrationVerify;
