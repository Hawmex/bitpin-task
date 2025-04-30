import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";

export default function () {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    navigate("/markets");
  }, [navigate]);

  return null;
}
