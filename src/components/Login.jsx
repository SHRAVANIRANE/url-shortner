import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PacmanLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import useFetch from "@/hooks/UseFetch";
import { login } from "@/db/apiAuth";
import { useEffect } from "react";

const Login = () => {
  const [errors, setErrors] = React.useState({});
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);

  useEffect(() => {
    console.log("Login data updated.", data);
    console.log("Login error.", error);
  }, [error, data]);

  const handleLogin = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is Required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is Required"),
      });
      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};
      e.inner?.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            to your account if you already have one
          </CardDescription>
          {error && <Error message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
          </div>
          {errors.email && <Error message={errors.email} />}
          <div className="space-y-2">
            <Input
              name="password"
              type="password"
              placeholder="Enter your Password"
              onChange={handleInputChange}
            />
            {errors.password && <Error message={errors.password} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={loading} onClick={handleLogin}>
            {loading ? (
              <PacmanLoader size={10} color={"#36d7b7"} margin={2} />
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
