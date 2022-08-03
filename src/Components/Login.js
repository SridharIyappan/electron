import axios from "axios";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
const { ipcRenderer } = window.require("electron");
const log = window.require("electron-log")
const login = log.scope("login")
// import log from "electron-log";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [macId, setMacId] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [background, setBackground] = useState(false);
  const shell = window.require("electron").shell;
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let location = useLocation();
  // setMacId(location.state);

  useEffect(() => {
    if (typeof window !== "undefined") {
      ipcRenderer.on("sending", (event, arg) => {
        console.log("arg start", arg, "arg End");
        setMacId(arg);
      });
    }
    console.log(background);
  }, [forgot, background]);

  const passwordVisibilityClick = () => {
    setShowPassword(!showPassword);
  };

  const subcriptionBtn = () => {
    shell.openExternal("https://imageproof.ai/");
    log.info(`Subscription`)
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const d = {
      email: email,
      password: password,
      macId: macId,
    };
    console.log(d)
    if (email === "" || password === "") {
      setError(true);
    } else {
      try {
        const { data } = await axios.post(
          `https://beta.imageproof.ai/api/login`,
          d
        );
        console.log(data);
        const photographer = JSON.stringify(data.photographer);
        if (data.success) {
          login.info()
          log.info(`${data.msg}`)
          swal({
            title: "success",
            text: data.msg,
            button: "Ok",
            icon: "success",
          });
          log.info(`User Detail: ${photographer}`)
          navigate("/dashboard");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", photographer);
          dispatch(addUser(data.photographer));
        } else {
          const da = JSON.stringify(d);
          log.error(`${data.msg}`)
          log.error(`${da}`)
          if (!data.subcription) {
            swal({
              title: "error",
              text: data.msg,
              button: "Ok!",
              icon: "error",
            });
            setTimeout(() => {
              shell.openExternal("https://imageproof.ai/");
            }, 3000);
          } else {
            swal({
              title: "error",
              text: data.msg,
              button: "Ok",
              icon: "error",
            });
          }
        }
      } catch (error) {
        console.log(error);
        log.error(`${error}`);
      }
    }
  };
  return (
    <>
      <div className={background ? "App popup-active" : "App"}>
        <div className="Login">
          <form onSubmit={loginSubmit}>
            <h3>Login</h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {error && email === "" ? (
              <span className="error-msg">Please Enter Register Email id</span>
            ) : (
              <></>
            )}
            <div className="input-container">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
              />
              {showPassword ? (
                <AiOutlineEye
                  className="password-icon"
                  onClick={passwordVisibilityClick}
                />
              ) : (
                <AiOutlineEyeInvisible
                  fill="grey"
                  className="password-icon"
                  onClick={passwordVisibilityClick}
                />
              )}
            </div>

            {error && password === "" ? (
              <span className="error-msg">Please Enter Password</span>
            ) : (
              <></>
            )}
            <br />
            <div className="login-account">
              <div>
                <a onClick={subcriptionBtn}>
                  I don't have account?<span> Register</span>
                </a>
              </div>
              <div>
                <button type="submit">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
